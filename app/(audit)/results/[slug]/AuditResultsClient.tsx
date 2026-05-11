"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Share2,
  Check,
  ArrowRight,
  Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadRequestSchema, LeadRequestInput } from "@/components/forms/form-schemas";
import { ApiResponse } from "@/lib/types";

interface AuditResultsClientProps {
  auditId: string;
  publicSlug: string;
  monthlySavings: number;
}

export default function AuditResultsClient({
  auditId,
  publicSlug,
  monthlySavings,
}: AuditResultsClientProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  // 1. Form Setup for Lead Capture
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LeadRequestInput>({
    resolver: zodResolver(leadRequestSchema),
    defaultValues: {
      auditId: auditId,
      email: "",
    },
    mode: "onChange",
  });

  // 2. Handle Sharing
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/${publicSlug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  // 3. Handle Lead Capture Submission
  const onCaptureLead = async (data: LeadRequestInput) => {
    setIsCapturing(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json() as ApiResponse<{ success: boolean }>

      if (result.success) {
        setIsLeadCaptured(true);
        toast.success("Report saved! We've sent a confirmation to your email.");
      } else {
        toast.error(result.error?.message || "Failed to save your report.");
      }
    } catch {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-slate-500" />
          <p className="text-sm text-slate-600">
            This report is currently <span className="font-semibold">private</span>.
          </p>
        </div>
        <Button
          onClick={handleShare}
          variant="outline"
          className="w-full sm:w-auto items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Report
        </Button>
      </div>

      {/* High Savings CTA - Credex Feature */}
      {monthlySavings > 500 && (
        <div className="border border-slate-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-widest">
                Optimization Opportunity
              </p>
              <h3 className="text-xl font-bold text-slate-900">
                You&apos;re saving over ${monthlySavings}/mo!
              </h3>
              <p className="text-slate-600 max-w-md text-sm">
                Your AI stack has significant optimization potential. Credex can
                help you implement these changes and manage your AI infrastructure
                for maximum efficiency.
              </p>
            </div>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              onClick={() => window.open('https://credex.com', '_blank')}
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lead Capture Section */}
      <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
        {!isLeadCaptured ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Save Your Audit Report</h3>
              <p className="text-slate-600 text-sm">
                Enter your email to receive a copy of this analysis and future optimization tips.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onCaptureLead)}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="flex-1 space-y-1">
                <Input
                  {...register("email")}
                  placeholder="name@company.com"
                  className="h-10"
                  type="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={!isValid || isCapturing}
                className="h-10 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
              >
                {isCapturing ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  "Save Report"
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-900">Report Saved!</h3>
            <p className="text-slate-600 text-sm max-w-xs">
              We&apos;ve sent a copy of your audit to your inbox. Check your email for the full breakdown.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
