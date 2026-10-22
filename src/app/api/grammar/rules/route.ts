import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GOLDEN_RULES, GRAMMAR_STAGES } from '@/lib/golden-rules-curriculum';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stageQuery = searchParams.get('stage');
    const ruleIdQuery = searchParams.get('ruleId');

    let rules = GOLDEN_RULES;

    if (stageQuery) {
      const stageNum = parseInt(stageQuery, 10);
      if (!isNaN(stageNum)) {
        rules = rules.filter((r) => r.stageNumber === stageNum);
      }
    }

    if (ruleIdQuery) {
      const singleRule = rules.find((r) => r.id === ruleIdQuery);
      if (!singleRule) {
        return NextResponse.json({ success: false, error: 'Rule not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        rule: singleRule,
      });
    }

    return NextResponse.json({
      success: true,
      totalRules: GOLDEN_RULES.length,
      stages: GRAMMAR_STAGES,
      rules,
    });
  } catch (error: any) {
    console.error('Error fetching golden rules:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ruleId, questionId, selectedAnswer, spokenTranscript } = body;

    const rule = GOLDEN_RULES.find((r) => r.id === ruleId);
    if (!rule) {
      return NextResponse.json({ success: false, error: 'Rule not found' }, { status: 404 });
    }

    if (action === 'evaluate_practice') {
      const question = rule.practiceQuestions.find((q) => q.id === questionId);
      if (!question) {
        return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
      }

      let isCorrect = false;
      let score = 0;
      let feedbackHindi = '';
      let recognizedText = '';

      if (question.type === 'speech_translation') {
        recognizedText = (spokenTranscript || selectedAnswer || '').trim().toLowerCase();
        const targetClean = question.targetEnglish.trim().toLowerCase().replace(/[.,?!]/g, '');
        const recognizedClean = recognizedText.replace(/[.,?!]/g, '');

        // Word overlap matching & pronoun tolerance
        const targetWords = targetClean.split(/\s+/);
        const spokenWords = recognizedClean.split(/\s+/);
        const matches = targetWords.filter((w) => spokenWords.includes(w)).length;
        const accuracy = Math.round((matches / targetWords.length) * 100);

        // Accept if > 60% overlap or exact phrase match
        if (accuracy >= 60 || recognizedClean.includes(targetClean) || targetClean.includes(recognizedClean)) {
          isCorrect = true;
          score = Math.max(accuracy, 85);
          feedbackHindi = `शाबाश! आपने बहुत स्पष्ट उच्चारण के साथ बोला। आरती दीदी को गर्व है!`;
        } else {
          isCorrect = false;
          score = accuracy;
          feedbackHindi = `थोड़ा और प्रयास कीजिए। सही वाक्य है: "${question.targetEnglish}"। दोबारा बोलकर देखिए!`;
        }
      } else {
        // MCQ or Fill-in-the-blank
        recognizedText = selectedAnswer || '';
        isCorrect =
          recognizedText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        score = isCorrect ? 100 : 0;
        feedbackHindi = isCorrect
          ? `बिल्कुल सही जवाब! ${question.explanationHindi}`
          : `ध्यान से देखिए: ${question.hintHindi}. सही उत्तर है: "${question.correctAnswer}".`;
      }

      // If user is authenticated or demo user Shanti Devi, award points
      let pointsAwarded = 0;
      if (isCorrect) {
        pointsAwarded = 25;
        try {
          const user = await prisma.user.findFirst({
            where: { email: 'shanti.devi@boloenglish.com' },
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                totalPoints: { increment: pointsAwarded },
              },
            });
          }
        } catch (dbErr) {
          console.warn('Could not increment user points:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        isCorrect,
        score,
        recognizedText,
        feedbackHindi,
        pointsAwarded,
        ruleTitleHindi: rule.titleHindi,
        nextRuleId: getNextRuleId(rule.id),
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error evaluating golden rule practice:', error);
    return NextResponse.json({ success: false, error: 'Evaluation failed' }, { status: 500 });
  }
}

function getNextRuleId(currentRuleId: string): string | null {
  const currentIndex = GOLDEN_RULES.findIndex((r) => r.id === currentRuleId);
  if (currentIndex >= 0 && currentIndex < GOLDEN_RULES.length - 1) {
    return GOLDEN_RULES[currentIndex + 1].id;
  }
  return null;
}
