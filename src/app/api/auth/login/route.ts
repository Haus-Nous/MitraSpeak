import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { comparePassword, createAuthResponse } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/security';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`auth_login_${ip}`, { intervalMs: 60000, maxRequests: 8 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 60 seconds before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid email or password format' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      await logAudit({
        action: 'USER_LOGIN_FAILED',
        resource: 'auth',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent'),
        details: { email: normalizedEmail, reason: 'USER_NOT_FOUND' },
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      await logAudit({
        userId: user.id,
        action: 'USER_LOGIN_FAILED',
        resource: 'auth',
        ipAddress: ip,
        userAgent: request.headers.get('user-agent'),
        details: { email: normalizedEmail, reason: 'BAD_PASSWORD' },
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update streak if needed
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = user.streakCount;
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveDate: new Date(),
        streakCount: newStreak,
      },
    });

    await logAudit({
      userId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      resource: 'auth',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
      details: { role: user.role, streakCount: newStreak },
    });

    return createAuthResponse(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'ADMIN' | 'LEARNER',
      },
      {
        message: 'Login successful',
        streakCount: newStreak,
        totalPoints: user.totalPoints,
        accessibilityPreferences: JSON.parse(user.accessibilityPreferences || '{}'),
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
