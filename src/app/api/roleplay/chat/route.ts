import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/security';
import { normalizeText } from '@/lib/ai-engine';

const roleplaySchema = z.object({
  scenarioId: z.string().default('general'),
  character: z.string().default('AI Language Partner'),
  message: z.string().min(1, 'Message cannot be empty'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string(),
  })).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limit = rateLimit(`roleplay_${ip}`, { intervalMs: 30000, maxRequests: 15 });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Speech evaluation rate limit reached. Please wait a few seconds.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = roleplaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { scenarioId, character } = parsed.data;
    const userMessage = sanitizeString(parsed.data.message);
    const norm = normalizeText(userMessage);

    // Scenario-specific AI conversational English coaching responses
    let assistantReply = '';
    let supportiveCoaching = '';
    let speechClarityScore = 90;

    if (scenarioId.includes('doctor') || scenarioId.includes('clinic')) {
      if (norm.includes('ache') || norm.includes('dizzy') || norm.includes('pain') || norm.includes('headache') || norm.includes('shoulder')) {
        assistantReply = "Thank you for explaining clearly. How long has this been occurring, and on a scale of 1 to 10, how intense would you say the discomfort is?";
        supportiveCoaching = "Excellent job describing your physical symptom with specificity! Stating the exact location helps your doctor tremendously.";
        speechClarityScore = 96;
      } else if (norm.includes('two days') || norm.includes('yesterday') || norm.includes('morning') || norm.includes('week')) {
        assistantReply = "Understood. That timeline is very helpful. Let me examine your shoulder and check your blood pressure now.";
        supportiveCoaching = "Great use of temporal expressions ('two days', 'in the morning'). Time markers are key in medical English.";
        speechClarityScore = 94;
      } else {
        assistantReply = "I understand. Could you please describe where you feel the discomfort and when it first started?";
        supportiveCoaching = "Tip: When speaking to a physician, mention the exact location of the sensation (e.g. 'in my shoulder', 'in my lower back').";
        speechClarityScore = 80;
      }
    } else if (scenarioId.includes('supermarket') || scenarioId.includes('checkout') || scenarioId.includes('shop')) {
      if (norm.includes('card') || norm.includes('cash')) {
        assistantReply = "Wonderful. I've processed your payment. Here is your itemized printed receipt and change. Have a lovely rest of your day!";
        supportiveCoaching = "Great job stating your payment method clearly and directly.";
        speechClarityScore = 95;
      } else if (norm.includes('receipt')) {
        assistantReply = "Certainly! Here is your printed receipt in the bag. Is there anything else I can help you find today?";
        supportiveCoaching = "Polite request using 'please' or 'could I' works wonderfully in retail settings.";
        speechClarityScore = 92;
      } else {
        assistantReply = "Thank you! Would you prefer to pay with credit card, debit, or cash today?";
        supportiveCoaching = "Specify whether you are paying with cash or card.";
        speechClarityScore = 82;
      }
    } else {
      // General polite English dialogue / Lobby greeting
      if (norm.includes('morning') || norm.includes('afternoon') || norm.includes('evening') || norm.includes('hello') || norm.includes('hi')) {
        assistantReply = "Hello Arthur! It is so delightful to see you today. The weather is crisp outside. How has your morning been so far?";
        supportiveCoaching = "Very natural, warm greeting! Smiling while speaking naturally elevates your vocal warmth.";
        speechClarityScore = 95;
      } else if (norm.includes('how are you') || norm.includes('doing well')) {
        assistantReply = "I am doing wonderfully, thank you so much for asking! Have a wonderful and peaceful day.";
        supportiveCoaching = "Returning the courtesy with 'How are you?' is standard etiquette in English conversations.";
        speechClarityScore = 96;
      } else {
        assistantReply = `I hear you clearly! You said: "${userMessage}". That is very well expressed. How would you like to continue our practice?`;
        supportiveCoaching = "Clear pronunciation and steady pacing. Keep going!";
        speechClarityScore = 88;
      }
    }

    return NextResponse.json({
      success: true,
      reply: assistantReply,
      character,
      speechClarityScore,
      supportiveCoaching,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Roleplay chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process conversational dialogue' },
      { status: 500 }
    );
  }
}
