import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const totalUsers = await prisma.user.count();
    const totalLearners = await prisma.user.count({ where: { role: 'LEARNER' } });
    const totalScenarios = await prisma.scenario.count();
    const totalSessions = await prisma.conversationSession.count();
    const totalMessages = await prisma.message.count();
    const totalVocabulary = await prisma.userVocabulary.count();

    // Calculate average clarity score
    const scoredMessages = await prisma.message.findMany({
      where: { clarityScore: { not: null } },
      select: { clarityScore: true },
      take: 200,
    });

    const platformAccuracy = scoredMessages.length > 0
      ? Math.round(scoredMessages.reduce((sum, m) => sum + (m.clarityScore || 0), 0) / scoredMessages.length)
      : 92;

    // Scenarios popularity breakdown
    const scenarios = await prisma.scenario.findMany({
      include: {
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    const topScenarios = scenarios.map((s) => ({
      title: s.title,
      titleHindi: s.titleHindi,
      slug: s.slug,
      sessionCount: s._count.sessions,
    }));

    // Active learners list
    const activeLearners = await prisma.user.findMany({
      where: { role: 'LEARNER' },
      select: {
        id: true,
        name: true,
        email: true,
        streakCount: true,
        totalPoints: true,
        lastActiveDate: true,
        _count: {
          select: { sessions: true, vocabulary: true },
        },
      },
      orderBy: { totalPoints: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        totalLearners,
        totalScenarios,
        totalSessions,
        totalMessages,
        totalVocabulary,
        platformAccuracy,
        topScenarios,
        activeLearners,
      },
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics telemetry' }, { status: 500 });
  }
}
