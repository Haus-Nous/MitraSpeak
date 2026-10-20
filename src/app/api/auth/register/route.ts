import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, createAuthResponse } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeString, logAudit } from '@/lib/security';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['LEARNER', 'ADMIN']).optional().default('LEARNER'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`auth_reg_${ip}`, { intervalMs: 60000, maxRequests: 5 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password, role } = result.data;
    const name = sanitizeString(result.data.name);
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
        accessibilityPreferences: JSON.stringify({
          fontSize: 'normal',
          highContrast: false,
          soundSpeed: '1.0',
        }),
      },
    });

    await logAudit({
      userId: user.id,
      action: 'USER_REGISTER',
      resource: 'auth',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
      details: { email: user.email, role: user.role },
    });

    return createAuthResponse(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'ADMIN' | 'LEARNER',
      },
      { message: 'Registration successful' }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred while creating account' },
      { status: 500 }
    );
  }
}
