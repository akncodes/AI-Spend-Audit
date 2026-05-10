import { NextResponse } from 'next/server';
import { TOOL_CONFIGS } from '@/lib/tools-config';
import { ApiResponse } from '@/lib/types';

export async function GET(): Promise<NextResponse> {
  try {
    const tools = Object.values(TOOL_CONFIGS).map(config => ({
      toolId: config.toolId,
      name: config.name,
      plans: Object.values(config.plans).map(plan => ({
        planId: plan.planId,
        name: plan.name,
        price: plan.price,
        billing: plan.billing
      }))
    }));

    const response: ApiResponse<typeof tools> = {
      success: true,
      data: tools,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('error fetching tool configs:', error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch tool configurations.',
      },
    } as ApiResponse<null>, { status: 500 });
  }
}
