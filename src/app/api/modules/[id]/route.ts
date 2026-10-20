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

    const moduleItem = await prisma.module.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
          include: {
            exercises: {
              select: { id: true, type: true, prompt: true, orderIndex: true },
              orderBy: { orderIndex: 'asc' },
            },
            progress: authUser
              ? {
                  where: { userId: authUser.userId },
                  select: { completed: true, score: true, lastAttemptAt: true },
                }
              : false,
          },
        },
      },
    });

    if (!moduleItem) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, module: moduleItem });
  } catch (error) {
    console.error('Error fetching module by id:', error);
    return NextResponse.json({ error: 'Failed to retrieve module' }, { status: 500 });
  }
}
