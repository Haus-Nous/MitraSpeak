import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // ENGLISH_CORE or FINTECH_LITERACY

    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const modules = await prisma.module.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
      include: {
        lessons: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            durationMinutes: true,
            pointsReward: true,
            progress: authUser
              ? {
                  where: { userId: authUser.userId },
                  select: { completed: true, score: true },
                }
              : false,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const formatted = modules.map(mod => {
      const totalLessons = mod.lessons.length;
      let completedLessons = 0;

      if (authUser) {
        completedLessons = mod.lessons.filter(
          l => Array.isArray(l.progress) && l.progress.some(p => p.completed)
        ).length;
      }

      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...mod,
        totalLessons,
        completedLessons,
        percentComplete: percent,
      };
    });

    return NextResponse.json({ success: true, modules: formatted });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
  }
}
