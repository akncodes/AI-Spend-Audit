import React from "react";
import { Trash2, Wrench as ToolIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolConfig, SelectedTool } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  tools: ToolConfig[];
  selectedTools: SelectedTool[];
  onAddTool: (toolId: string) => void;
  onRemoveTool: (toolId: string) => void;
  onUpdateTool: (toolId: string, updates: Partial<SelectedTool>) => void;
}

export default function ToolSelector({
  tools,
  selectedTools,
  onAddTool,
  onRemoveTool,
  onUpdateTool,
}: Props) {
  const getToolConfig = (toolId: string) =>
    tools.find((t) => t.toolId === toolId);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-900">
          Select AI Tools to Audit
        </Label>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => {
            const isSelected = selectedTools.some(
              (st) => st.toolId === tool.toolId,
            );
            return (
              <Button
                key={tool.toolId}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "rounded-full px-4 py-2 transition-all duration-200",
                  isSelected
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "text-slate-600 hover:border-teal-500 hover:text-teal-600",
                )}
                onClick={() =>
                  isSelected
                    ? onRemoveTool(tool.toolId)
                    : onAddTool(tool.toolId)
                }
              >
                {tool.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {selectedTools.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border border-slate-200 rounded-lg text-center">
            <p className="text-slate-600 font-medium mb-1">No tools selected yet.</p>
            <p className="text-sm text-slate-500">
              Click a tool above to start auditing your spend.
            </p>
          </div>
        )}

        {selectedTools.map((selected) => {
          const config = getToolConfig(selected.toolId);
          if (!config) return null;

          return (
            <div
              key={selected.toolId}
              className="p-4 border border-slate-200 rounded-lg relative group transition-all hover:border-teal-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ToolIcon className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-slate-900">{config.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-400 hover:text-red-500 transition-colors h-8 w-8"
                  onClick={() => onRemoveTool(selected.toolId)}
                  aria-label={`Remove ${config.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Plan
                  </Label>
                  <Select
                    value={selected.planId}
                    onValueChange={(val) =>
                      onUpdateTool(selected.toolId, { planId: val })
                    }
                  >
                    <SelectTrigger className="w-full text-blue-400 h-10">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {config.plans.map((plan) => (
                        <SelectItem key={plan.planId} value={plan.planId}>
                          {plan.name} (${plan.price}/mo)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Monthly Spend ($)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7 text-blue-400  h-10"
                      value={selected.monthlySpend}
                      onChange={(e) =>
                        onUpdateTool(selected.toolId, {
                          monthlySpend: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Seats
                  </Label>
                  <Input
                    type="number"
                    className="h-10 text-blue-400"
                    value={selected.seats}
                    onChange={(e) =>
                      onUpdateTool(selected.toolId, {
                        seats: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
