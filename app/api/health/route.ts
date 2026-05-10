import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

/**
 * GET /api/health
 * Simple liveness check endpoint to verify that the application is running.
 * Used by monitoring tools and deployment platforms.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const response: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[API_HEALTH_GET] Health check failed:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'The application health check failed.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
