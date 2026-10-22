import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  SVO_CHALLENGES,
  AUXILIARY_DRILLS,
  LEVEL_0_LESSONS,
  AARTI_DIDI_AVATAR_MESSAGES,
} from '@/lib/level0-curriculum';

export const dynamic = 'force-dynamic';

const svoSchema = z.object({
  action: z.literal('evaluate_svo'),
  exerciseId: z.string(),
  constructedSentence: z.string().optional(),
  arrangedTokens: z.array(z.string()).optional(),
  targetSentence: z.string().optional(),
});

const auxSchema = z.object({
  action: z.literal('evaluate_auxiliary'),
  drillId: z.string(),
  chosenWord: z.string().optional(),
  selectedVerb: z.string().optional(),
  targetWord: z.string().optional(),
});

const voiceSchema = z.object({
  action: z.literal('evaluate_voice'),
  targetSentence: z.string(),
  userSpoken: z.string().optional(),
  spokenText: z.string().optional(),
  lessonId: z.string().optional(),
});

export async function GET() {
  try {
    // Return lessons from database if available, else static fallback
    const dbLessons = await prisma.lesson.findMany({
      where: { level: 'LEVEL_0' },
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({
      success: true,
      lessons: dbLessons.length > 0 ? dbLessons : LEVEL_0_LESSONS,
      svoChallenges: SVO_CHALLENGES,
      auxiliaryDrills: AUXILIARY_DRILLS,
      avatarMessages: AARTI_DIDI_AVATAR_MESSAGES,
    });
  } catch (error) {
    console.error('Error fetching grammar lessons:', error);
    return NextResponse.json(
      {
        success: true,
        lessons: LEVEL_0_LESSONS,
        svoChallenges: SVO_CHALLENGES,
        auxiliaryDrills: AUXILIARY_DRILLS,
        avatarMessages: AARTI_DIDI_AVATAR_MESSAGES,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    // Optional user token
    let userId: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        userId = payload.userId;
      } catch {
        // Fallback or unauthenticated guest
      }
    }

    // Fallback learner if needed
    if (!userId) {
      const defaultUser = await prisma.user.findFirst({ where: { role: 'LEARNER' } });
      if (defaultUser) userId = defaultUser.id;
    }

    // -------------------------------------------------------------
    // ACTION 1: EVALUATE SVO SENTENCE BUILDING
    // -------------------------------------------------------------
    if (action === 'evaluate_svo') {
      const parsed = svoSchema.parse(body);
      const exercise = SVO_CHALLENGES.find((s) => s.id === parsed.exerciseId);

      const userSentence = (
        parsed.constructedSentence ||
        (parsed.arrangedTokens ? parsed.arrangedTokens.join(' ') : '')
      ).trim();

      const targetSentence = (
        parsed.targetSentence ||
        exercise?.targetSentence ||
        'I eat fresh apples'
      ).trim();

      const normalize = (str: string) =>
        str.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

      let isCorrect = false;
      if (normalize(userSentence) === normalize(targetSentence)) {
        isCorrect = true;
      } else if (parsed.arrangedTokens && parsed.arrangedTokens.length >= 3) {
        const firstToken = parsed.arrangedTokens[0].toLowerCase().trim();
        const secondToken = parsed.arrangedTokens[1].toLowerCase().trim();
        const subjects = ['i', 'he', 'she', 'they', 'we', 'ramesh', 'you'];
        const verbs = [
          'eat',
          'am',
          'is',
          'are',
          'was',
          'were',
          'drink',
          'drinking',
          'play',
          'playing',
          'reading',
          'buying',
        ];

        if (subjects.includes(firstToken) && verbs.some((v) => secondToken.includes(v))) {
          isCorrect = true;
        }
      }

      let feedbackHindi = '';
      let avatarMood = 'explaining';

      if (isCorrect) {
        feedbackHindi =
          'शाबाश! आपने बिल्कुल सही वाक्य बनाया। कर्ता (Subject) + क्रिया (Verb) + कर्म (Object)।';
        avatarMood = 'cheering';

        if (userId) {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: { totalPoints: { increment: 20 } },
            });

            // Update or create CurriculumProgress
            const lesson = await prisma.lesson.findFirst({
              where: { category: 'SENTENCE_BUILDING' },
            });
            if (lesson) {
              await prisma.curriculumProgress.upsert({
                where: {
                  userId_lessonId: {
                    userId,
                    lessonId: lesson.id,
                  },
                },
                update: {
                  svoMastery: { increment: 1 },
                  score: 100,
                  avatarMood: 'celebrating',
                  completed: true,
                  completedAt: new Date(),
                },
                create: {
                  userId,
                  lessonId: lesson.id,
                  level: 'LEVEL_0',
                  svoMastery: 1,
                  score: 100,
                  avatarMood: 'celebrating',
                  completed: true,
                  completedAt: new Date(),
                },
              });
            }

            // Log transcript
            await prisma.sessionTranscript.create({
              data: {
                userId,
                sessionType: 'LEVEL_0_CLASSROOM',
                avatarState: 'cheering',
                userSpeech: userSentence,
                aiPrompt: 'Bahut achha! SVO sentence matched target.',
                aiAudioEmotion: 'proud',
                accuracy: 100,
                feedbackHindi,
              },
            });
          } catch (err) {
            console.warn('DB progress update skipped:', err);
          }
        }
      } else {
        feedbackHindi =
          'थोड़ा सा ध्यान दीजिए: अंग्रेजी में कर्ता (Subject) के तुरंत बाद क्रिया (Verb) आती है।';
        avatarMood = 'explaining';
      }

      return NextResponse.json({
        success: true,
        isCorrect,
        accuracy: isCorrect ? 100 : 50,
        pointsAwarded: isCorrect ? 20 : 0,
        feedbackHindi,
        hindiFeedback: feedbackHindi,
        avatarMood,
        idealSentence: targetSentence,
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: EVALUATE AUXILIARY VERBS (is / am / are / was / were)
    // -------------------------------------------------------------
    if (action === 'evaluate_auxiliary') {
      const parsed = auxSchema.parse(body);
      const drill = AUXILIARY_DRILLS.find((d) => d.id === parsed.drillId);

      const chosen = (parsed.chosenWord || parsed.selectedVerb || '').trim().toLowerCase();
      const target = (parsed.targetWord || drill?.targetWord || '').trim().toLowerCase();

      const isCorrect = chosen === target && chosen.length > 0;
      const explanationHindi = drill
        ? drill.explanationHindi
        : `सही उत्तर "${target}" है।`;

      let feedbackHindi = '';
      let avatarMood = 'explaining';

      if (isCorrect) {
        feedbackHindi = `शाबाश! बिल्कुल सही उत्तर: "${chosen}"। ${explanationHindi}`;
        avatarMood = 'cheering';

        if (userId) {
          try {
            await prisma.user.update({
              where: { id: userId },
              data: { totalPoints: { increment: 10 } },
            });

            // Update auxiliary mastery JSON
            const lesson = await prisma.lesson.findFirst({
              where: {
                category: drill?.tense === 'past' ? 'PAST_AUXILIARY' : 'AUXILIARY_VERBS',
              },
            });

            if (lesson) {
              const existingProg = await prisma.curriculumProgress.findUnique({
                where: { userId_lessonId: { userId, lessonId: lesson.id } },
              });

              let masteryObj: Record<string, number> = {};
              try {
                if (existingProg?.auxiliaryMastery) {
                  masteryObj = JSON.parse(existingProg.auxiliaryMastery);
                }
              } catch {
                masteryObj = {};
              }

              masteryObj[chosen] = (masteryObj[chosen] || 0) + 1;

              await prisma.curriculumProgress.upsert({
                where: { userId_lessonId: { userId, lessonId: lesson.id } },
                update: {
                  auxiliaryMastery: JSON.stringify(masteryObj),
                  avatarMood: 'celebrating',
                  score: 100,
                  completed: true,
                },
                create: {
                  userId,
                  lessonId: lesson.id,
                  level: 'LEVEL_0',
                  auxiliaryMastery: JSON.stringify(masteryObj),
                  avatarMood: 'celebrating',
                  score: 100,
                  completed: true,
                },
              });
            }
          } catch (err) {
            console.warn('DB auxiliary update skipped:', err);
          }
        }
      } else {
        feedbackHindi = `गलत चुनाव! यहाँ "${target}" आएगा। ${explanationHindi}`;
        avatarMood = 'explaining';
      }

      return NextResponse.json({
        success: true,
        isCorrect,
        chosenWord: chosen,
        targetWord: target,
        pointsAwarded: isCorrect ? 10 : 0,
        feedbackHindi,
        hindiFeedback: feedbackHindi,
        avatarMood,
        explanationHindi,
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: EVALUATE SPOKEN SENTENCE REPEAT
    // -------------------------------------------------------------
    if (action === 'evaluate_voice') {
      const parsed = voiceSchema.parse(body);
      const spoken = (parsed.userSpoken || parsed.spokenText || '').trim();
      const target = parsed.targetSentence.trim();

      const targetWords = target
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean);
      const userWords = spoken
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean);

      let matchedCount = 0;
      const wordStatus = targetWords.map((tw) => {
        const matched = userWords.includes(tw);
        if (matched) matchedCount++;
        return { word: tw, matched };
      });

      const accuracy =
        targetWords.length > 0
          ? Math.round((matchedCount / targetWords.length) * 100)
          : 0;
      const isMatch = accuracy >= 75;

      const feedbackHindi = isMatch
        ? 'अरे वाह! आपकी आवाज बिल्कुल स्पष्ट है। आरती दीदी को आप पर गर्व है!'
        : 'बहुत अच्छी कोशिश! एक बार और आरती दीदी को सुनकर दोहराएँ।';

      const avatarMood = isMatch ? 'cheering' : 'explaining';

      if (isMatch && userId) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { totalPoints: { increment: 15 } },
          });

          await prisma.sessionTranscript.create({
            data: {
              userId,
              sessionType: 'LEVEL_0_CLASSROOM',
              avatarState: 'speaking',
              userSpeech: spoken,
              aiPrompt: target,
              aiAudioEmotion: 'warm',
              accuracy,
              feedbackHindi,
            },
          });
        } catch (err) {
          console.warn('DB transcript update error:', err);
        }
      }

      return NextResponse.json({
        success: true,
        accuracy,
        isMatch,
        isSuccess: isMatch,
        pointsAwarded: isMatch ? 15 : 0,
        feedbackHindi,
        hindiFeedback: feedbackHindi,
        avatarMood,
        wordStatus,
      });
    }

    return NextResponse.json({ error: 'Invalid action provided' }, { status: 400 });
  } catch (err: any) {
    console.error('Grammar evaluation error:', err);
    return NextResponse.json({ error: err.message || 'Evaluation failed' }, { status: 500 });
  }
}
