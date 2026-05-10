import { supabase } from "@/lib/supabase";
import { AuditResponse } from "@/lib/types";

export async function getAuditBySlug(slug: string): Promise<AuditResponse | null> {
  if (!slug) {
    throw new Error("slug is required");
  }

  const { data: audit, error: dbError } = await supabase
    .from("audits")
    .select("id, public_slug, recommendations, total_savings_monthly, ai_summary")
    .eq("public_slug", slug)
    .single();

  if (dbError) {
    // PGRST116 = no rows found
    if (dbError.code === "PGRST116") {
      return null;
    }

    console.error("db error fetching audit:", dbError);
    throw new Error(`Database error: ${dbError.message}`);
  }

  if (!audit) {
    return null;
  }

  return {
    auditId: audit.id,
    publicSlug: audit.public_slug,
    currentSpend: {
      // FIXME: currentSpend isn't stored separately — need to add that column later
      monthly: 0,
      annual: 0,
    },
    recommendations: audit.recommendations,
    totalSavings: {
      monthly: audit.total_savings_monthly,
      annual: audit.total_savings_monthly * 12,
    },
    summary: audit.ai_summary,
  };
}
