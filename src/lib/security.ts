import { prisma } from './prisma';

/**
 * Strips script tags, HTML entities, and malicious characters from strings
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Sanitizes object keys and values recursively
 */
export function sanitizePayload<T>(payload: T): T {
  if (typeof payload === 'string') {
    return sanitizeString(payload) as unknown as T;
  }
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item)) as unknown as T;
  }
  if (payload !== null && typeof payload === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(payload)) {
      cleaned[sanitizeString(key)] = sanitizePayload(value);
    }
    return cleaned as T;
  }
  return payload;
}

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  resource: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, any> | string | null;
}

export async function logAudit({
  userId = null,
  action,
  resource,
  ipAddress = '127.0.0.1',
  userAgent = 'Unknown Client',
  details = null,
}: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        ipAddress,
        userAgent,
        details: typeof details === 'object' && details !== null ? JSON.stringify(details) : details,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
