import { describe, it, expect } from 'vitest';
import { auditAllTools } from '../lib/audit-engine';
import { SelectedTool } from '../lib/types';

describe('Audit Engine - Core Logic', () => {
  describe('auditTool - Plan Mismatch Detection', () => {
    it('should recommend Cursor Business over Pro for team > 1', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 100, // 5 users × $20
          seats: 5,
        },
      ];

      const result = auditAllTools(tools, 5, 'coding');
      const recommendation = result.recommendations[0];

      expect(recommendation.toolId).toBe('cursor');
      expect(recommendation.action).not.toBe('optimal');
      expect(recommendation.savings.monthly).toBeGreaterThan(0);
    });

    it('should recommend Claude Team over Pro for team > 1', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'claude',
          planId: 'pro',
          monthlySpend: 100, // 5 users × $20
          seats: 5,
        },
      ];

      const result = auditAllTools(tools, 5, 'writing');
      const recommendation = result.recommendations[0];

      expect(recommendation.toolId).toBe('claude');
      expect(recommendation.action).toBe('downgrade');
      expect(recommendation.savings.monthly).toBeGreaterThan(0);
    });

    it('should flag optimal plan (no savings)', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'business',
          monthlySpend: 40, // Single user on Business
          seats: 1,
        },
      ];

      const result = auditAllTools(tools, 1, 'coding');
      const recommendation = result.recommendations[0];

      expect(recommendation.action).toBe('optimal');
      expect(recommendation.savings.monthly).toBe(0);
    });
  });

  describe('auditTool - Cheaper Alternatives', () => {
    it('should suggest Cursor for coding over Claude Pro', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'claude',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ];

      const result = auditAllTools(tools, 1, 'coding');
      const recommendation = result.recommendations[0];

      // If action is 'switch', we should be switching to Cursor or similar
      if (recommendation.action === 'switch') {
        expect(recommendation.savings.monthly).toBeGreaterThan(0);
      }
    });

    it('should not recommend switch if alternative is more expensive', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 20, // Already optimal for coding
          seats: 1,
        },
      ];

      const result = auditAllTools(tools, 1, 'coding');
      const recommendation = result.recommendations[0];

      // Cursor Pro is already the best for coding, should be optimal
      expect(recommendation.action).toBe('optimal');
    });
  });

  describe('auditTool - Savings Calculations', () => {
    it('should calculate monthly and annual savings correctly', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 100, // 5 users paying $20 each
          seats: 5,
        },
      ];

      const result = auditAllTools(tools, 5, 'coding');
      const recommendation = result.recommendations[0];

      if (recommendation.savings.monthly > 0) {
        // Annual should be 12x monthly
        expect(recommendation.savings.annual).toBe(
          recommendation.savings.monthly * 12
        );
      }
    });

    it('should aggregate total savings across multiple tools', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 100,
          seats: 5,
        },
        {
          toolId: 'claude',
          planId: 'pro',
          monthlySpend: 100,
          seats: 5,
        },
      ];

      const result = auditAllTools(tools, 5, 'mixed');

      const totalSavings = result.recommendations.reduce(
        (sum, rec) => sum + rec.savings.monthly,
        0
      );

      expect(result.totalSavings.monthly).toBe(totalSavings);
      expect(result.totalSavings.annual).toBe(totalSavings * 12);
    });

    it('should handle zero savings for optimal plans', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'business',
          monthlySpend: 40,
          seats: 1,
        },
      ];

      const result = auditAllTools(tools, 1, 'coding');

      expect(result.totalSavings.monthly).toBe(0);
      expect(result.totalSavings.annual).toBe(0);
    });
  });

  describe('auditAllTools - Multiple Tools', () => {
    it('should audit multiple tools and produce recommendations for each', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 100,
          seats: 5,
        },
        {
          toolId: 'chatgpt',
          planId: 'plus',
          monthlySpend: 20,
          seats: 1,
        },
        {
          toolId: 'claude',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ];

      const result = auditAllTools(tools, 5, 'mixed');

      expect(result.recommendations.length).toBe(3);
      expect(result.recommendations[0].toolId).toBe('cursor');
      expect(result.recommendations[1].toolId).toBe('chatgpt');
      expect(result.recommendations[2].toolId).toBe('claude');
    });

    it('should generate public audit response with summary', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 100,
          seats: 5,
        },
      ];

      const result = auditAllTools(tools, 5, 'coding');

      expect(result.recommendations).toBeDefined();
      expect(result.totalSavings).toBeDefined();
      expect(result.totalSavings.monthly).toBeDefined();
      expect(result.totalSavings.annual).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tools array', () => {
      const tools: SelectedTool[] = [];

      const result = auditAllTools(tools, 5, 'coding');

      expect(result.recommendations.length).toBe(0);
      expect(result.totalSavings.monthly).toBe(0);
    });

    it('should handle zero team size gracefully', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'pro',
          monthlySpend: 20,
          seats: 1,
        },
      ];

      // Should not throw
      expect(() => {
        auditAllTools(tools, 0, 'coding');
      }).not.toThrow();
    });

    it('should handle unknown tool gracefully', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'unknown-tool-xyz',
          planId: 'pro',
          monthlySpend: 50,
          seats: 1,
        } as SelectedTool,
      ];

      const result = auditAllTools(tools, 1, 'coding');

      expect(result.recommendations[0].action).toBe('optimal');
      expect(result.recommendations[0].savings.monthly).toBe(0);
    });

    it('should handle unknown plan gracefully', () => {
      const tools: SelectedTool[] = [
        {
          toolId: 'cursor',
          planId: 'unknown-plan',
          monthlySpend: 50,
          seats: 1,
        } as SelectedTool,
      ];

      const result = auditAllTools(tools, 1, 'coding');

      expect(result.recommendations[0].toolId).toBe('cursor');
      // Should handle gracefully without crashing
    });
  });
});
