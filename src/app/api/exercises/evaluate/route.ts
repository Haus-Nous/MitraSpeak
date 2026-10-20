import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';
import { evaluateExercise } from '@/lib/ai-engine';
import { logAudit, sanitizeString } from '@/lib/security';

const evaluateSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID is required'),
  userResponse: z.string().min(1, 'Response cannot be empty'),
  latencyMs: z.number().optional().default(1200),
});

export async function POST(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    const body = await request.json();
    const parsed = evaluateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid request body' },
        { status: 400 }
      );
    }

    const { exerciseId, latencyMs } = parsed.data;
    const userResponse = sanitizeString(parsed.data.userResponse);

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        lesson: {
          select: { id: true, pointsReward: true, title: true },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    // Run AI Evaluation
    const evalResult = evaluateExercise({
      type: exercise.type,
      userResponse,
      correctResponse: exercise.correctResponse,
      optionsJson: exercise.optionsJson,
      explanation: exercise.explanation,
    });

    let savedResultId = null;

    if (authUser) {
      // Record quiz result
      const quizRecord = await prisma.quizResult.create({
        data: {
          userId: authUser.userId,
          exerciseId,
          userResponse,
          isCorrect: evalResult.isCorrect,
          feedback: evalResult.supportiveFeedback,
          latencyMs,
        },
      });
      savedResultId = quizRecord.id;

      // Update User Progress
      const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: authUser.userId,
            lessonId: exercise.lesson.id,
          },
        },
      });

      const earnedScore = Math.max(existingProgress?.score || 0, evalResult.score);
      const isCompleted = earnedScore >= 70;

      await prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId: authUser.userId,
            lessonId: exercise.lesson.id,
          },
        },
        create: {
          userId: authUser.userId,
          lessonId: exercise.lesson.id,
          completed: isCompleted,
          score: earnedScore,
          attempts: 1,
          lastAttemptAt: new Date(),
          completedAt: isCompleted ? new Date() : null,
        },
        update: {
          completed: isCompleted,
          score: earnedScore,
          attempts: { increment: 1 },
          lastAttemptAt: new Date(),
          completedAt: isCompleted ? (existingProgress?.completedAt ?? new Date()) : null,
        },
      });

      // Award points if correct
      if (evalResult.isCorrect) {
        const pointsToAdd = Math.round((evalResult.score / 100) * 20);
        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            totalPoints: { increment: pointsToAdd },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      resultId: savedResultId,
      evaluation: evalResult,
    });
  } catch (error) {
    console.error('Error evaluating exercise:', error);
    return NextResponse.json(
      { error: 'An error occurred during evaluation' },
      { status: 500 }
    );
  }
}
