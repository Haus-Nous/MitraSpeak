import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/security';
import {
  translateHindiToEnglish,
  analyzeEnglishMistakes,
  getOralChallenges,
} from '@/lib/translate-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level')?.toLowerCase();

    let challenges = getOralChallenges();
    if (level && level !== 'all') {
      challenges = challenges.filter((c) => c.level.toLowerCase() === level);
    }

    return NextResponse.json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error('Error fetching oral challenges:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve oral challenges' },
      { status: 500 }
    );
  }
}

const translateCoachSchema = z.object({
  action: z.enum(['translate', 'verify']),
  hindiText: z.string().min(1, 'Hindi or Hinglish input is required'),
  targetEnglish: z.string().optional(),
  userAttempt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`translate_coach_${ip}`, { intervalMs: 30000, maxRequests: 25 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another request.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = translateCoachSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { action, hindiText, targetEnglish, userAttempt } = parsed.data;
    const sanitizedHindi = sanitizeString(hindiText);

    // MODE 1: Translate Hindi to English & return phonetic audio guide
    if (action === 'translate') {
      const translation = translateHindiToEnglish(sanitizedHindi);
      return NextResponse.json({
        success: true,
        translation,
      });
    }

    // MODE 2: Verify user's English attempt & diagnose all mistakes
    if (action === 'verify') {
      if (!userAttempt || userAttempt.trim().length === 0) {
        return NextResponse.json(
          { error: 'Please provide your spoken or typed English attempt to verify.' },
          { status: 400 }
        );
      }

      const sanitizedTarget = sanitizeString(targetEnglish || '');
      const sanitizedAttempt = sanitizeString(userAttempt);

      const verification = analyzeEnglishMistakes({
        hindiText: sanitizedHindi,
        targetEnglish: sanitizedTarget || sanitizedHindi,
        userAttempt: sanitizedAttempt,
      });

      // Identify user for progress award
      const authUser = extractAuthUser(request);
      let targetUserId = authUser?.userId;
      if (!targetUserId) {
        const defaultUser = await prisma.user.findFirst({
          where: { email: 'shanti.devi@boloenglish.com' },
        });
        targetUserId = defaultUser?.id;
      }

      if (targetUserId) {
        try {
          await prisma.user.update({
            where: { id: targetUserId },
            data: {
              totalPoints: { increment: 20 },
              lastActiveDate: new Date(),
            },
          });

          await prisma.auditLog.create({
            data: {
              userId: targetUserId,
              action: 'TRANSLATE_PRACTICE_VERIFY',
              resource: 'translate-coach',
              ipAddress: ip,
              details: JSON.stringify({
                hindi: sanitizedHindi.substring(0, 50),
                score: verification.score,
                mistakesCount: verification.mistakes.length,
              }),
            },
          });
        } catch (dbErr) {
          console.warn('Could not record user practice points:', dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        verification,
        pointsAwarded: 20,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Translate coach API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred in Translate Coach' },
      { status: 500 }
    );
  }
}
