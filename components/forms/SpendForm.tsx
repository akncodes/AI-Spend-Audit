"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import ToolSelector from "./ToolSelector";
import {
  auditRequestSchema,
  AuditRequestInput,
  SelectedToolInput
} from "./form-schemas";
import { ToolConfig } from "@/lib/types";
import { ApiResponse } from "@/lib/types";

const FORM_STORAGE_KEY = "ai-spend-audit-form-state";

export default function SpendForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolConfig[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: {
      tools: [],
      teamSize: 1,
      useCase: "coding",
    },
    mode: "onChange",
  });

  const { append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  const selectedTools = watch("tools");

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/tools");
        const json: ApiResponse<ToolConfig[]> = await res.json();
        if (json.success && json.data) {
          setTools(json.data);
        } else {
          toast.error("Failed to load AI tool configurations.");
        }
      } catch {
        toast.error("Network error while loading tools.");
      } finally {
        setIsLoadingTools(false);
      }
    }
    fetchTools();
  }, []);

  // restore saved form state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setValue("tools", parsed.tools || []);
        setValue("teamSize", parsed.teamSize || 1);
        setValue("useCase", parsed.useCase || "coding");
      } catch {
        // corrupted data, just ignore
        console.log("couldn't restore form state");
      }
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAddTool = (toolId: string) => {
    const existing = selectedTools.find((t) => t.toolId === toolId);
    if (existing) return;

    const toolConfig = tools.find((t) => t.toolId === toolId);
    const defaultPlan = toolConfig?.plans[0] || { planId: "pro", price: 20 };

    append({
      toolId,
      planId: defaultPlan.planId,
      monthlySpend: defaultPlan.price,
      seats: 1,
    });
  };

  const handleRemoveTool = (toolId: string) => {
    const index = selectedTools.findIndex((t) => t.toolId === toolId);
    if (index !== -1) {
      remove(index);
    }
  };

  const handleUpdateTool = (toolId: string, updates: Partial<SelectedToolInput>) => {
    const index = selectedTools.findIndex((t) => t.toolId === toolId);
    if (index !== -1) {
      const currentTool = selectedTools[index];
      setValue(`tools.${index}`, { ...currentTool, ...updates }, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  };

  const onSubmit = async (data: AuditRequestInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json() as ApiResponse<{ publicSlug: string }>

      if (result.success && result.data) {
        toast.success("Audit complete! Analyzing your savings...");
        router.push(`/results/${result.data.publicSlug}`);
      } else {
        toast.error(result.error?.message || "An error occurred during audit.");
      }
    } catch {
      toast.error("Failed to submit audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTools) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-slate-500 animate-pulse">Loading tool configurations...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-teal-600" />
          AI Spend Audit
        </h2>
        <p className="text-sm text-slate-600">Configure your AI stack to identify potential savings.</p>
      </div>

      <ToolSelector
        tools={tools}
        selectedTools={(selectedTools || []) as SelectedToolInput[]}
        onAddTool={handleAddTool}
        onRemoveTool={handleRemoveTool}
        onUpdateTool={handleUpdateTool}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t text-blue-400 border-slate-200">
        <div className="space-y-2">
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            {...register("teamSize")}
            placeholder="e.g. 5"
          />
          {errors.teamSize && (
            <p className="text-xs text-red-500 mt-1">{errors.teamSize.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="useCase">Primary Use Case</Label>
          <Select
            value={getValues("useCase")}
            onValueChange={(val) => setValue("useCase", val as 'coding' | 'writing' | 'data' | 'research' | 'mixed', { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 text-blue-400">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coding">Coding & Development</SelectItem>
              <SelectItem value="writing">Content & Copywriting</SelectItem>
              <SelectItem value="data">Data Analysis</SelectItem>
              <SelectItem value="research">Research & Strategy</SelectItem>
              <SelectItem value="mixed">Mixed / General Purpose</SelectItem>
            </SelectContent>
          </Select>
          {errors.useCase && (
            <p className="text-xs text-red-500 mt-1">{errors.useCase.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full py-6 text-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all rounded-lg"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Spend...
            </>
          ) : (
            "Analyze My Spend"
          )}
        </Button>
        {!isValid && selectedTools.length === 0 && (
          <p className="text-center text-sm text-slate-400 mt-3">
            Please select at least one AI tool to begin the audit.
          </p>
        )}
      </div>
    </form>
  );
}
