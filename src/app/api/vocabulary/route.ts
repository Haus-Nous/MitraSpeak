import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { extractAuthUser } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';

export const dynamic = 'force-dynamic';

const addVocabSchema = z.object({
  word: z.string().min(1, 'Word or phrase is required'),
  hindiMeaning: z.string().min(1, 'Hindi meaning is required'),
  phonetic: z.string().optional(),
  exampleSentence: z.string().optional(),
  category: z.string().optional().default('Everyday'),
});

export async function GET(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    let targetUserId = authUser?.userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'shanti.devi@boloenglish.com' },
      });
      targetUserId = defaultUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: true, vocabulary: [] });
    }

    const vocabulary = await prisma.userVocabulary.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, vocabulary });
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json({ error: 'Failed to retrieve vocabulary' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = extractAuthUser(request);
    let targetUserId = authUser?.userId;

    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'shanti.devi@boloenglish.com' },
      });
      targetUserId = defaultUser?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = addVocabSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const word = sanitizeString(parsed.data.word);
    const hindiMeaning = sanitizeString(parsed.data.hindiMeaning);
    const phonetic = parsed.data.phonetic ? sanitizeString(parsed.data.phonetic) : null;
    const exampleSentence = parsed.data.exampleSentence ? sanitizeString(parsed.data.exampleSentence) : null;
    const category = parsed.data.category ? sanitizeString(parsed.data.category) : 'Everyday';

    const item = await prisma.userVocabulary.create({
      data: {
        userId: targetUserId,
        word,
        hindiMeaning,
        phonetic,
        exampleSentence,
        category,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error adding vocabulary:', error);
    return NextResponse.json({ error: 'Failed to bookmark word' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.userVocabulary.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
