import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auditRequestSchema } from "@/components/forms/form-schemas";
import { auditAllTools } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/ai-service";
import { supabase } from "@/lib/supabase";
import { ApiResponse } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    console.log("audit request received", body);

    const validation = auditRequestSchema.safeParse(body);

    if (!validation.success) {
      const flattened = validation.error.flatten();
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: Object.values(flattened.fieldErrors)[0]?.[0] || "Invalid input",
          },
        },
        { status: 400 },
      );
    }

    const auditData = validation.data;

    const calculatedResults = auditAllTools(
      auditData.tools,
      auditData.teamSize,
      auditData.useCase,
    );

    let summary = '';
    try {
      summary = await generateAuditSummary(
        calculatedResults as Omit<AuditResponse, 'summary'>
      );
    } catch (aiError) {
      console.error('AI summary failed, continuing without it:', aiError);
      summary = 'Summary could not be generated, but your savings data is accurate.';
    }

    const publicSlug = nanoid(10);

    const { data: dbAudit, error: dbError } = await supabase
      .from("audits")
      .insert({
        public_slug: publicSlug,
        tools_selected: auditData.tools,
        team_size: auditData.teamSize,
        vertical: auditData.useCase,
        current_spend_monthly: calculatedResults.currentSpend.monthly,
        recommended_spend_monthly:
          calculatedResults.currentSpend.monthly -
          calculatedResults.totalSavings.monthly,
        total_savings_monthly: calculatedResults.totalSavings.monthly,
        recommendations: calculatedResults.recommendations,
        ai_summary: summary,
      })
      .select()
      .single();

    if (dbError) {
      console.error("db insert failed:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: `Database error: ${dbError.message}`,
          },
        },
        { status: 500 },
      );
    }

    const response: ApiResponse<{
      auditId: string;
      publicSlug: string;
      currentSpend: typeof calculatedResults.currentSpend;
      recommendations: typeof calculatedResults.recommendations;
      totalSavings: typeof calculatedResults.totalSavings;
      summary: string;
    }> = {
      success: true,
      data: {
        auditId: dbAudit.id,
        publicSlug: publicSlug,
        currentSpend: calculatedResults.currentSpend,
        recommendations: calculatedResults.recommendations,
        totalSavings: calculatedResults.totalSavings,
        summary: summary,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("unexpected error in audit route:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred.",
        },
      },
      { status: 500 },
    );
  }
}
