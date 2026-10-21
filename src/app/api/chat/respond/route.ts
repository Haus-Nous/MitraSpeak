import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/security';
import { generateAartiCoaching } from '@/lib/aarti-engine';

const respondSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  scenarioSlug: z.string().default('sabzi-mandi'),
  characterName: z.string().default('Aarti Didi'),
  userMessage: z.string().min(1, 'Message cannot be empty'),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`chat_respond_${ip}`, { intervalMs: 30000, maxRequests: 20 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending your next voice message.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = respondSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { sessionId, scenarioSlug, characterName } = parsed.data;
    const rawUserMessage = sanitizeString(parsed.data.userMessage);

    // Verify session
    const session = await prisma.conversationSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        scenario: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Conversation session not found' }, { status: 404 });
    }

    // Generate Aarti Didi coaching
    const coaching = generateAartiCoaching({
      scenarioSlug: session.scenario?.slug || scenarioSlug,
      characterName: session.scenario?.characterName || characterName,
      userText: rawUserMessage,
    });

    // Save User Message with gentle correction card details
    const userMsgRecord = await prisma.message.create({
      data: {
        sessionId,
        sender: 'USER',
        text: rawUserMessage,
        correctedSentence: coaching.correction,
        explanationHindi: coaching.explanationHindi,
        clarityScore: coaching.clarityScore,
      },
    });

    // Save AI Character Response with Hindi translation
    const aiMsgRecord = await prisma.message.create({
      data: {
        sessionId,
        sender: 'AI',
        text: coaching.reply,
        hindiTranslation: coaching.hindiTranslation,
      },
    });

    // Award 25 points for active practice & update last active date
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        totalPoints: { increment: 25 },
        lastActiveDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      reply: aiMsgRecord.text,
      hindiTranslation: aiMsgRecord.hindiTranslation,
      clarityScore: coaching.clarityScore,
      correction: coaching.correction ? {
        correctedSentence: coaching.correction,
        explanationHindi: coaching.explanationHindi,
      } : null,
      userMessage: userMsgRecord,
      aiMessage: aiMsgRecord,
      coaching: {
        correction: coaching.correction,
        explanationHindi: coaching.explanationHindi,
        clarityScore: coaching.clarityScore,
        detectedHinglishWords: coaching.detectedHinglishWords,
      },
    });
  } catch (error) {
    console.error('Chat response error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message' },
      { status: 500 }
    );
  }
}
