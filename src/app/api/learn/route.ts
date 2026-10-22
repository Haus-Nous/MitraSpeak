import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/security';
import {
  IDIOMS_AND_PHRASES,
  GRAMMAR_TOPICS,
  CONVERSATION_TEMPLATES,
  REPEAT_DRILLS,
  evaluateRepeatAttempt,
} from '@/lib/learning-hub';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const level = searchParams.get('level')?.toLowerCase();

    const filterByLevel = <T extends { level: string }>(items: T[]) => {
      if (!level || level === 'all') return items;
      return items.filter((item) => item.level.toLowerCase() === level);
    };

    const idioms = filterByLevel(IDIOMS_AND_PHRASES);
    const grammar = filterByLevel(GRAMMAR_TOPICS);
    const templates = filterByLevel(CONVERSATION_TEMPLATES);
    const drills = filterByLevel(REPEAT_DRILLS);

    if (section === 'idioms') {
      return NextResponse.json({ success: true, data: idioms });
    }
    if (section === 'grammar') {
      return NextResponse.json({ success: true, data: grammar });
    }
    if (section === 'templates') {
      return NextResponse.json({ success: true, data: templates });
    }
    if (section === 'drills') {
      return NextResponse.json({ success: true, data: drills });
    }

    return NextResponse.json({
      success: true,
      idioms,
      grammar,
      templates,
      drills,
    });
  } catch (error) {
    console.error('Error fetching learning hub data:', error);
    return NextResponse.json({ error: 'Failed to fetch learning resources' }, { status: 500 });
  }
}

const evaluateSchema = z.object({
  action: z.enum(['evaluate_repeat', 'submit_quiz']),
  targetEnglish: z.string().optional(),
  userSpoken: z.string().optional(),
  drillId: z.string().optional(),
  userAttempt: z.string().optional(),
  topicId: z.string().optional(),
  isCorrect: z.boolean().optional(),
  selectedOptionIndex: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`learn_${ip}`, { intervalMs: 30000, maxRequests: 30 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = evaluateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { action, targetEnglish, userSpoken, drillId, userAttempt, topicId, isCorrect, selectedOptionIndex } = parsed.data;

    // Identify user
    const authUser = extractAuthUser(request);
    let targetUserId = authUser?.userId;
    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'shanti.devi@boloenglish.com' },
      });
      targetUserId = defaultUser?.id;
    }

    // ACTION 1: Evaluate Listen & Repeat Attempt
    if (action === 'evaluate_repeat') {
      let resolvedTarget = targetEnglish;
      if (!resolvedTarget && drillId) {
        const drill = REPEAT_DRILLS.find((d) => d.id === drillId);
        if (drill) resolvedTarget = drill.targetEnglish;
      }

      const resolvedSpoken = userSpoken || userAttempt;

      if (!resolvedTarget || !resolvedSpoken) {
        return NextResponse.json(
          { error: 'Both target English sentence and spoken attempt are required.' },
          { status: 400 }
        );
      }

      const evaluation = evaluateRepeatAttempt(
        sanitizeString(resolvedTarget),
        sanitizeString(resolvedSpoken)
      );

      // Award +15 fluency points if successful
      if (targetUserId && evaluation.isSuccess) {
        try {
          await prisma.user.update({
            where: { id: targetUserId },
            data: {
              totalPoints: { increment: 15 },
              lastActiveDate: new Date(),
            },
          });
          await prisma.auditLog.create({
            data: {
              userId: targetUserId,
              action: 'LISTEN_AND_REPEAT_COMPLETED',
              resource: 'learning-hub',
              ipAddress: ip,
              details: JSON.stringify({
                target: resolvedTarget.substring(0, 40),
                accuracy: evaluation.accuracy,
              }),
            },
          });
        } catch (e) {
          console.error('Error awarding repeat points:', e);
        }
      }

      return NextResponse.json({
        success: true,
        evaluation: {
          ...evaluation,
          accuracyPercentage: evaluation.accuracy,
        },
        pointsAwarded: evaluation.isSuccess ? 15 : 0,
      });
    }

    // ACTION 2: Submit Grammar Quiz Answer
    if (action === 'submit_quiz') {
      let resolvedCorrect = isCorrect ?? false;
      if (topicId && typeof selectedOptionIndex === 'number') {
        const topic = GRAMMAR_TOPICS.find((g) => g.id === topicId);
        if (topic) {
          resolvedCorrect = topic.quiz.correctIndex === selectedOptionIndex;
        }
      }

      if (targetUserId && resolvedCorrect) {
        try {
          await prisma.user.update({
            where: { id: targetUserId },
            data: {
              totalPoints: { increment: 10 },
              lastActiveDate: new Date(),
            },
          });
          await prisma.auditLog.create({
            data: {
              userId: targetUserId,
              action: 'GRAMMAR_QUIZ_COMPLETED',
              resource: 'learning-hub',
              ipAddress: ip,
              details: JSON.stringify({ topicId, isCorrect }),
            },
          });
        } catch (e) {
          console.error('Error awarding quiz points:', e);
        }
      }

      return NextResponse.json({
        success: true,
        isCorrect: resolvedCorrect,
        pointsAwarded: resolvedCorrect ? 10 : 0,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('Learning hub POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
