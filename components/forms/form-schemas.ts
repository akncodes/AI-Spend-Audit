import { z } from 'zod';

export const selectedToolSchema = z.object({
  toolId: z.string().min(1, 'Tool ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  monthlySpend: z.coerce.number().min(0, 'Spend cannot be negative'),
  seats: z.coerce.number().int().min(1, 'At least 1 seat is required'),
});

export const auditRequestSchema = z.object({
  tools: z.array(selectedToolSchema).min(1, 'Please select at least one AI tool to audit'),
  teamSize: z.coerce.number().int().min(1, 'Team size must be at least 1').max(500, 'Team size cannot exceed 500'),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed'], {
    message: 'Please select a valid use case',
  }),
});

// used for the email capture form after results
export const leadRequestSchema = z.object({
  auditId: z.string().uuid('A valid audit ID is required'),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  companyName: z.string().optional(),
  teamSize: z.string().optional(),
  vertical: z.string().optional(),
});

export type SelectedToolInput = z.infer<typeof selectedToolSchema>;
export type AuditRequestInput = z.infer<typeof auditRequestSchema>;
export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
