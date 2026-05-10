import { NextRequest, NextResponse } from 'next/server';
import { leadRequestSchema } from '@/components/forms/form-schemas';
import { supabase } from '@/lib/supabase';
import { sendAuditReportEmail } from '@/lib/email-service';
import { ApiResponse, AuditResponse } from '@/lib/types';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const validation = leadRequestSchema.safeParse(body);

    if (!validation.success) {
      const flattened = validation.error.flatten();
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: Object.values(flattened.fieldErrors)[0]?.[0] || "Invalid input",
        },
      }, { status: 400 });
    }

    const leadData = validation.data;

    const { data: dbLead, error: dbError } = await supabase
      .from('leads')
      .insert({
        audit_id: leadData.auditId,
        email: leadData.email,
        company_name: leadData.companyName,
        team_size: leadData.teamSize,
        vertical: leadData.vertical,
      })
      .select()
      .single();

    if (dbError) {
      // 23505 = unique constraint violation (duplicate email + audit)
      if (dbError.code === '23505') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'This email has already been submitted for this audit.',
          },
        }, { status: 409 });
      }

      console.error('leads db error:', dbError);
      return NextResponse.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to save lead.',
        },
      }, { status: 500 });
    }

    // fetch audit so we can send the email report
    const { data: auditData, error: auditError } = await supabase
      .from('audits')
      .select('*')
      .eq('id', leadData.auditId)
      .single();

    if (!auditError && auditData) {
      const mappedAudit: AuditResponse = {
        auditId: auditData.id,
        publicSlug: auditData.public_slug,
        currentSpend: {
          monthly: auditData.current_spend_monthly,
          annual: auditData.current_spend_monthly * 12,
        },
        recommendations: auditData.recommendations || [],
        totalSavings: {
          monthly: auditData.total_savings_monthly,
          annual: auditData.total_savings_monthly * 12,
        },
        summary: auditData.ai_summary,
      };

      // fire-and-forget — don't block the response on email delivery
      sendAuditReportEmail(
        leadData.email,
        mappedAudit,
        mappedAudit.publicSlug
      ).catch((err) => {
        console.error('email send failed:', err);
      });
    }

    const response: ApiResponse<{
      leadId: string;
      email: string;
      createdAt: string;
    }> = {
      success: true,
      data: {
        leadId: dbLead.id,
        email: dbLead.email,
        createdAt: dbLead.captured_at,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('unexpected error in leads route:', error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
    }, { status: 500 });
  }
}
