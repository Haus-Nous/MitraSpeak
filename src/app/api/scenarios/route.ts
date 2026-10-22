import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');

    const where: any = {};
    if (difficulty && difficulty.toUpperCase() !== 'ALL') {
      where.difficulty = difficulty.toUpperCase();
    }

    const scenarios = await prisma.scenario.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    });

    return NextResponse.json({
      success: true,
      scenarios,
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Failed to retrieve scenarios' }, { status: 500 });
  }
}
