import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'linguaflow-pro-super-secure-jwt-secret-key-production-grade';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'LEARNER';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function extractAuthUser(request: NextRequest): TokenPayload | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (decoded) return decoded;
  }

  // Check auth cookie
  const cookie = request.cookies.get('linguaflow_token');
  if (cookie?.value) {
    const decoded = verifyToken(cookie.value);
    if (decoded) return decoded;
  }

  return null;
}

export function createAuthResponse(payload: TokenPayload, additionalData: Record<string, any> = {}) {
  const token = signToken(payload);
  const response = NextResponse.json({
    success: true,
    user: payload,
    token,
    ...additionalData,
  });

  // Set httpOnly secure cookie
  response.cookies.set('linguaflow_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
