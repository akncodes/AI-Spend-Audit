import { NextRequest, NextResponse } from "next/server";
import { getAuditBySlug } from "@/lib/audit-service";
import { ApiResponse } from "@/lib/types";

/**
 * GET /api/audit/[slug]
 * Retrieves a public audit result using its unique slug.
 * This endpoint is used by the share page (/share/[slug]) to display the audit results.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Audit slug is required.",
          },
        },
        { status: 400 },
      );
    }

    // Use the shared service to retrieve audit data.
    // This ensures consistency between the API route and Server Components.
    const audit = await getAuditBySlug(slug);

    if (!audit) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "The requested audit report was not found.",
          },
        },
        { status: 404 },
      );
    }

    // Return the audit data wrapped in a consistent ApiResponse
    const response: ApiResponse<typeof audit> = {
      success: true,
      data: audit,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[API_AUDIT_GET] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while fetching the audit.",
        },
      },
      { status: 500 },
    );
  }
}
