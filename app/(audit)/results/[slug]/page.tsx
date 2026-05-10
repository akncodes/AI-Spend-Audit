import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiResponse, AuditResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowUpRight, Share2, Sparkles } from "lucide-react";
import AuditResultsClient from "./AuditResultsClient";

/**
 * Results Page
 *
 * This is a Server Component that fetches the audit data based on the slug.
 * It provides the initial data to the Client Component for interactivity.
 *
 * Path: /results/[slug]
 */
export default async function ResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the audit data from the API
  // Note: In a real Next.js app, we'd use a direct database call here for performance,
  // but for consistency with the architecture, we call the API.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/audit/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch audit results");
    }

    const result: ApiResponse<AuditResponse> = await response.json();

    if (!result.success || !result.data) {
      notFound();
    }

    const audit = result.data;

    return (
      <div className="min-h-screen bg-white">
        {/* Minimal Header */}
        <header className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              AI Spend Audit
            </span>
          </Link>
          <Button variant="outline" className="flex items-center gap-2 h-9">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          {/* 1. Savings Summary Section */}
          <section className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none px-3 py-1 text-xs font-semibold">
                Audit Complete
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Your Potential Savings
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="p-6 border border-gray-200 rounded-lg flex flex-col">
                <span className="text-gray-500 font-medium uppercase tracking-wider text-xs mb-3">Monthly Savings</span>
                <span className="text-4xl md:text-5xl font-bold text-teal-600">
                  ${audit.totalSavings.monthly.toLocaleString()}
                </span>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg flex flex-col">
                <span className="text-gray-500 font-medium uppercase tracking-wider text-xs mb-3">Annual Savings</span>
                <span className="text-4xl md:text-5xl font-bold text-teal-600">
                  ${audit.totalSavings.annual.toLocaleString()}
                </span>
              </div>
            </div>
          </section>

          {/* 2. Recommendations Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Optimization Plan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {audit.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {rec.toolId.toUpperCase()}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs uppercase tracking-tighter font-medium",
                        rec.action === 'optimal' ? "bg-gray-100 text-gray-600" : "bg-teal-100 text-teal-700"
                      )}
                    >
                      {rec.action}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-teal-600">${rec.savings.monthly}</span>
                    <span className="text-sm text-gray-500 ml-1">/mo saved</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {rec.reason}
                  </p>
                  {rec.targetPlan && (
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-medium text-gray-500">
                      <span>Target: {rec.targetPlan}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. AI Summary Section */}
          <section className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-teal-600 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              AI Strategic Summary
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              "{audit.summary}"
            </p>
          </section>

          {/* 4. Lead Capture & Actions (Client Component) */}
          <div className="max-w-2xl">
            <AuditResultsClient
              auditId={audit.auditId}
              publicSlug={audit.publicSlug}
              monthlySavings={audit.totalSavings.monthly}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[RESULTS_PAGE] Error fetching audit:", error);
    notFound();
  }
}

// Helper for conditional class names since I can't use a separate utility file here
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
