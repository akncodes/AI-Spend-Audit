import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowUpRight, Sparkles, Calculator } from "lucide-react";
import { getAuditBySlug } from "@/lib/audit-service";

/**
 * Public Share Page
 *
 * This page displays a read-only version of an audit report.
 * It is designed for social sharing and public visibility,
 * meaning all PII (emails, company names) are stripped out.
 *
 * Path: /share/[slug]
 */

// Dynamic metadata for SEO and social sharing (OG Tags)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const audit = await getAuditBySlug(slug);
    if (!audit) return { title: "AI Spend Audit Report" };

    return {
      title: `AI Spend Audit: Save $${audit.totalSavings.monthly}/mo`,
      description: `This team optimized their AI stack and identified $${audit.totalSavings.annual} in annual savings. See how you can do the same.`,
      openGraph: {
        title: `AI Spend Audit: Save $${audit.totalSavings.monthly}/mo`,
        description: `See the optimization plan for this AI stack.`,
        type: "website",
        url: `${baseUrl}/share/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `AI Spend Audit: Save $${audit.totalSavings.monthly}/mo`,
      },
    };
  } catch {
    return { title: "AI Spend Audit Report" };
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let audit: AuditResponse;

  try {
    const data = await getAuditBySlug(slug);
    if (!data) {
      notFound();
    }
    audit = data;
  } catch (error) {
    console.error("[SHARE_PAGE] Error retrieving audit:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            AI Spend Audit
          </span>
        </Link>
        <Button
          variant="outline"
          className="hidden md:flex items-center gap-2"
          asChild
        >
          <Link href="/">Run Your Own Audit</Link>
        </Button>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-12">
        {/* 1. Public Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Public Audit Report
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Identified Savings
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center space-y-2">
              <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">
                Monthly Savings
              </span>
              <span className="text-5xl md:text-6xl font-black text-teal-600">
                ${audit.totalSavings.monthly.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center space-y-2">
              <span className="text-gray-500 font-medium uppercase tracking-wider text-xs">
                Annual Savings
              </span>
              <span className="text-5xl md:text-6xl font-black text-teal-600">
                ${audit.totalSavings.annual.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Recommendations Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Optimization Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audit.recommendations.map((rec, idx) => (
              <Card
                key={idx}
                className="group hover:border-teal-500 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {rec.toolId.toUpperCase()}
                    </CardTitle>
                    <div
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        rec.action === "optimal"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {rec.action}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-teal-600">
                      ${rec.savings.monthly}
                    </span>
                    <span className="text-sm text-gray-500">/mo saved</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rec.reason}
                  </p>
                  {rec.targetPlan && (
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-500">
                      <span>Target: {rec.targetPlan}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. AI Summary Section */}
        <section className="relative bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <Sparkles className="w-12 h-12 text-teal-50 opacity-20" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              AI Strategic Summary
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
              &ldquo;{audit.summary}&rdquo;
            </p>
          </div>
        </section>

        {/* 4. Call to Action */}
        <section className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Want to optimize your own spend?
            </h3>
            <p className="text-gray-500">
              Stop guessing and start saving. Get a professional audit of your
              AI tools in seconds.
            </p>
          </div>
          <Button
            className="px-8 py-6 text-lg font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
            asChild
          >
            <Link href="/">
              <Calculator className="w-5 h-5" />
              Run Your Free Audit
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
