import { Resend } from 'resend';
import { AuditResponse } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'noreply@aispendy.com';
const FROM_NAME = 'AI Spend Audit';

/**
 * Sends an audit report email to the user
 */
export async function sendAuditReportEmail(
  email: string,
  audit: AuditResponse,
  publicSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/results/${publicSlug}`;

    // Format numbers for display
    const monthlySavings = audit.totalSavings.monthly.toLocaleString();
    const annualSavings = audit.totalSavings.annual.toLocaleString();

    // Build recommendations HTML
    const recommendationsHtml = audit.recommendations
      .map(
        (rec) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${rec.toolId.toUpperCase()}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          $${rec.savings.monthly}/mo
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${rec.reason}
        </td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              background: #f3f4f6;
              padding: 24px;
              text-align: center;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            .savings-box {
              background: #ecfdf5;
              border-left: 4px solid #14b8a6;
              padding: 16px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .savings-amount {
              font-size: 28px;
              font-weight: bold;
              color: #14b8a6;
            }
            .recommendations-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .recommendations-table th {
              text-align: left;
              padding: 12px;
              background: #f9fafb;
              border-bottom: 2px solid #e5e7eb;
              font-weight: 600;
            }
            .cta-button {
              display: inline-block;
              background: #14b8a6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; color: #1f2937;">Your AI Spend Audit Report</h1>
          </div>

          <p>Hi there,</p>

          <p>We've completed your AI spend audit. Here's what we found:</p>

          <div class="savings-box">
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Monthly Savings Potential</div>
            <div class="savings-amount">$${monthlySavings}</div>
            <div style="color: #6b7280; font-size: 14px; margin-top: 8px;">Annual: $${annualSavings}</div>
          </div>

          <h2 style="color: #1f2937; margin-top: 30px;">Optimization Recommendations</h2>

          <table class="recommendations-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Monthly Savings</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${recommendationsHtml}
            </tbody>
          </table>

          <h2 style="color: #1f2937;">AI Strategic Summary</h2>
          <p style="background: #f9fafb; padding: 16px; border-radius: 6px; border-left: 3px solid #14b8a6;">
            <em>"${audit.summary}"</em>
          </p>

          <div style="text-align: center;">
            <a href="${reportUrl}" class="cta-button">View Full Report</a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            You can also share this report with your team by visiting the link above.
          </p>

          <div class="footer">
            <p>
              © ${new Date().getFullYear()} AI Spend Audit by Credex. All rights reserved.<br>
              <a href="https://credex.com" style="color: #14b8a6; text-decoration: none;">Learn more about our services</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Your AI Spend Audit Report

Monthly Savings Potential: $${monthlySavings}
Annual Savings: $${annualSavings}

Recommendations:
${audit.recommendations.map((rec) => `- ${rec.toolId.toUpperCase()}: Save $${rec.savings.monthly}/mo - ${rec.reason}`).join('\n')}

AI Summary: "${audit.summary}"

View your full report: ${reportUrl}

© ${new Date().getFullYear()} AI Spend Audit by Credex
    `.trim();

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Your AI Spend Audit Report: Save $${monthlySavings}/month`,
      html: htmlContent,
      text: textContent,
      replyTo: 'support@credex.com',
    });

    if (result.error) {
      console.error('[EMAIL_SERVICE] Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[EMAIL_SERVICE] Email sent successfully:', result.data?.id);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL_SERVICE] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
