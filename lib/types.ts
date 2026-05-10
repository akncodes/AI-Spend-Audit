export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export interface Savings {
  monthly: number;
  annual: number;
}

export interface PlanConfig {
  planId: string;
  name: string;
  price: number;
  billing: 'monthly' | 'annual' | 'free';
}

export interface ToolConfig {
  toolId: string;
  name: string;
  plans: PlanConfig[];
}

export interface SelectedTool {
  toolId: string;
  planId: string;
  monthlySpend: number;
  seats: number;
}

export interface Recommendation {
  toolId: string;
  action: 'downgrade' | 'switch' | 'optimal';
  targetPlan?: string;
  savings: Savings;
  reason: string;
}

export interface AuditResponse {
  auditId: string;
  publicSlug: string;
  currentSpend: Savings;
  recommendations: Recommendation[];
  totalSavings: Savings;
  summary: string;
}

export interface AuditRequest {
  tools: SelectedTool[];
  teamSize: number;
  useCase: string;
}

export interface LeadRequest {
  auditId: string;
  email: string;
  companyName?: string;
  teamSize?: string;
  vertical?: string;
}

export interface LeadResponse {
  leadId: string;
  email: string;
  createdAt: string;
}

// TODO: expand these verticals later
export type UserVertical = 'coding' | 'writing' | 'data' | 'research' | 'mixed';
