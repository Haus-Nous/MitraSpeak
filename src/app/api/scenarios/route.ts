import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
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
