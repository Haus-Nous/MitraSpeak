import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        streakCount: true,
        totalPoints: true,
        accessibilityPreferences: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    let parsedPreferences = { fontSize: 'normal', highContrast: false, soundSpeed: '1.0' };
    try {
      parsedPreferences = JSON.parse(user.accessibilityPreferences);
    } catch {
      // default
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        accessibilityPreferences: parsedPreferences,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { accessibilityPreferences } = body;

    const updated = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        accessibilityPreferences: JSON.stringify(accessibilityPreferences),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accessibilityPreferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updated,
        accessibilityPreferences: JSON.parse(updated.accessibilityPreferences),
      },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
