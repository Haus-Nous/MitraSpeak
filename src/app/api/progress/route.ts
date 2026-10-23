import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    let targetUserId = authUser?.userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'shanti.devi@boloenglish.com' },
      });
      targetUserId = defaultUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          targetUserId ? { id: targetUserId } : {},
          authUser ? { email: authUser.email } : {},
          !authUser && !targetUserId ? { email: 'shanti.devi@boloenglish.com' } : {},
        ],
      },
      include: {
        sessions: {
          include: {
            scenario: true,
            _count: { select: { messages: true } },
          },
        },
        vocabulary: true,
        curriculumProgress: true,
      },
    });

    if (!user) {
      if (authUser) {
        return NextResponse.json({
          success: true,
          stats: {
            userName: authUser.name,
            streakCount: 1,
            totalPoints: 120,
            level: 1,
            nextLevelPoints: 200,
            currentLevelProgress: 120,
            totalSessions: 0,
            totalVocabCount: 0,
            totalMessagesExchanged: 0,
            dailyGoalMinutes: 15,
            todayMinutesSpent: 5,
            curriculumProgress: [],
          },
        });
      }
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    const totalSessions = user.sessions.length;
    const totalVocabCount = user.vocabulary.length;
    const totalMessagesExchanged = user.sessions.reduce(
      (acc, s) => acc + (s._count?.messages || 0),
      0
    );

    // Calculate level (1 level per 200 points)
    const level = Math.max(1, Math.floor(user.totalPoints / 200) + 1);
    const nextLevelPoints = level * 200;
    const currentLevelProgress = user.totalPoints % 200;

    return NextResponse.json({
      success: true,
      stats: {
        userName: user.name,
        streakCount: user.streakCount,
        totalPoints: user.totalPoints,
        level,
        nextLevelPoints,
        currentLevelProgress,
        totalSessions,
        totalVocabCount,
        totalMessagesExchanged,
        dailyGoalMinutes: 15,
        todayMinutesSpent: Math.min(15, totalSessions * 5 + 3),
        curriculumProgress: user.curriculumProgress || [],
      },
      recentSessions: user.sessions.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to retrieve progress' }, { status: 500 });
  }
}
