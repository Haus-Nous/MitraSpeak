import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = extractAuthUser(request);
    const { id } = params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: { id: true, title: true, slug: true, category: true },
        },
        exercises: {
          orderBy: { orderIndex: 'asc' },
        },
        progress: authUser
          ? {
              where: { userId: authUser.userId },
              select: { completed: true, score: true, attempts: true },
            }
          : false,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(lesson.contentJson);
    } catch {
      parsedContent = { raw: lesson.contentJson };
    }

    const formattedExercises = lesson.exercises.map(ex => {
      let parsedOptions = null;
      if (ex.optionsJson) {
        try {
          parsedOptions = JSON.parse(ex.optionsJson);
        } catch {
          parsedOptions = ex.optionsJson;
        }
      }

      // Hide exact correctResponse from client if it's a test/evaluation unless user is admin
      const isSensitiveQuiz = ex.type === 'FILL_BLANK' || ex.type === 'MATCHING';
      const shouldMaskResponse = isSensitiveQuiz && (!authUser || authUser.role !== 'ADMIN');

      return {
        id: ex.id,
        type: ex.type,
        prompt: ex.prompt,
        options: parsedOptions,
        explanation: ex.explanation,
        orderIndex: ex.orderIndex,
        // For flashcard, roleplay, or sentence build, client needs knowledge to render UI
        correctResponse: shouldMaskResponse ? undefined : ex.correctResponse,
      };
    });

    const userProgress = authUser && Array.isArray(lesson.progress) && lesson.progress.length > 0
      ? lesson.progress[0]
      : null;

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        durationMinutes: lesson.durationMinutes,
        pointsReward: lesson.pointsReward,
        orderIndex: lesson.orderIndex,
        module: lesson.module,
        content: parsedContent,
        exercises: formattedExercises,
        userProgress,
      },
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to retrieve lesson' }, { status: 500 });
  }
}
