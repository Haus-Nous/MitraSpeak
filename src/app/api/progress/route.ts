import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        progress: {
          include: {
            lesson: {
              include: {
                module: true,
              },
            },
          },
        },
        quizResults: {
          select: { isCorrect: true, latencyMs: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalLessons = await prisma.lesson.count();
    const completedProgress = user.progress.filter(p => p.completed);
    const completedLessonsCount = completedProgress.length;

    // Accuracy
    const totalQuizAttempts = user.quizResults.length;
    const correctAttempts = user.quizResults.filter(q => q.isCorrect).length;
    const accuracyRate = totalQuizAttempts > 0 ? Math.round((correctAttempts / totalQuizAttempts) * 100) : 92;

    // Modules breakdown
    const englishCompleted = completedProgress.length;

    // Next recommended lesson
    const completedLessonIds = completedProgress.map(p => p.lessonId);
    const nextLesson = await prisma.lesson.findFirst({
      where: {
        id: { notIn: completedLessonIds },
      },
      orderBy: [
        { module: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
      include: {
        module: {
          select: { id: true, title: true, category: true, icon: true },
        },
      },
    });

    // Level calculation (1 level per 250 points)
    const level = Math.max(1, Math.floor(user.totalPoints / 250) + 1);
    const nextLevelPoints = level * 250;
    const currentLevelProgress = user.totalPoints % 250;

    return NextResponse.json({
      success: true,
      stats: {
        streakCount: user.streakCount,
        totalPoints: user.totalPoints,
        level,
        nextLevelPoints,
        currentLevelProgress,
        completedLessonsCount,
        totalLessons,
        overallCompletionRate: totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0,
        accuracyRate,
        englishCompleted,
        dailyGoalMinutes: 15,
        todayMinutesSpent: Math.min(15, completedLessonsCount * 5 + 3),
      },
      recommendedLesson: nextLesson,
      recentActivity: user.progress.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to retrieve progress' }, { status: 500 });
  }
}
