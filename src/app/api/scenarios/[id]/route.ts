import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authUser = extractAuthUser(request);

    // Find scenario by id or slug
    const scenario = await prisma.scenario.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // Default to Shanti Devi if guest or not logged in
    let targetUserId = authUser?.userId;
    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'shanti.devi@boloenglish.com' },
      });
      targetUserId = defaultUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: true, scenario, session: null, messages: [] });
    }

    // Find or create session
    let session = await prisma.conversationSession.findFirst({
      where: {
        userId: targetUserId,
        scenarioId: scenario.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      session = await prisma.conversationSession.create({
        data: {
          userId: targetUserId,
          scenarioId: scenario.id,
          messages: {
            create: {
              sender: 'AI',
              text: scenario.starterAudioText,
              hindiTranslation: scenario.starterAudioHindi,
            },
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      scenario,
      sessionId: session.id,
      session: {
        id: session.id,
        createdAt: session.createdAt,
      },
      messages: session.messages,
    });
  } catch (error) {
    console.error('Error fetching scenario detail:', error);
    return NextResponse.json({ error: 'Failed to retrieve scenario' }, { status: 500 });
  }
}
