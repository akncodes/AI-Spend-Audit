import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import your form schemas from components/forms/form-schemas.ts
// This is a sample test for form validation

describe('Form Validation - Spend Form', () => {
  // Define schema inline for testing purposes
  const ToolSchema = z.object({
    toolId: z.string().min(1, 'Tool is required'),
    planId: z.string().min(1, 'Plan is required'),
    monthlySpend: z.number().min(0, 'Spend must be non-negative'),
    seats: z.number().min(1, 'At least 1 seat required'),
  });

  const SpendFormSchema = z.object({
    tools: z.array(ToolSchema).min(1, 'At least one tool is required'),
    teamSize: z.number().min(1, 'Team size must be at least 1'),
    useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  });

  it('should validate a correct form submission', () => {
    const validData = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = SpendFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      tools: [],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = SpendFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('should reject invalid spend (negative)', () => {
    const invalidData = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: -50, // Invalid: negative
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = SpendFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('should reject invalid use case', () => {
    const invalidData = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'invalid-use-case', // Invalid
    };

    const result = SpendFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('should accept multiple tools', () => {
    const validData = {
      tools: [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
        {
          toolId: 'claude',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
        {
          toolId: 'chatgpt',
          planId: 'plus',
          monthlySpend: 20,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'mixed',
    };

    const result = SpendFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });
});
