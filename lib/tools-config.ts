import { PlanConfig } from "./types";

export interface ToolConfiguration {
  toolId: string;
  name: string;
  plans: Record<string, PlanConfig & { minSeats?: number; maxSeats?: number }>;
  alternatives: Record<string, string>; // useCase -> toolId
}

// TODO: pull this from DB eventually so we can update without deploys
export const TOOL_CONFIGS: Record<string, ToolConfiguration> = {
  cursor: {
    toolId: "cursor",
    name: "Cursor",
    plans: {
      hobby: { planId: "hobby", name: "Hobby", price: 0, billing: "free" },
      pro: { planId: "pro", name: "Pro", price: 20, billing: "monthly" },
      business: {
        planId: "business",
        name: "Business",
        price: 40,
        billing: "monthly",
      },
    },
    alternatives: {},
  },
  claude: {
    toolId: "claude",
    name: "Claude",
    plans: {
      free: { planId: 'free', name: 'Free', price: 0, billing: 'free' },
      pro: { planId: 'pro', name: 'Pro', price: 20, billing: 'monthly' },
      team: { planId: 'team', name: 'Team', price: 15, billing: 'monthly' },
    },
    alternatives: {},
  },
  chatgpt: {
    toolId: "chatgpt",
    name: "ChatGPT",
    plans: {
      free: { planId: 'free', name: 'Free', price: 0, billing: 'free' },
      plus: { planId: 'plus', name: 'Plus', price: 20, billing: 'monthly' },
      team: { planId: 'team', name: 'Team', price: 25, billing: 'monthly' },
    },
    alternatives: {
      coding: "cursor", // suggest Cursor for coding
    },
  },
  "github-copilot": {
    toolId: "github-copilot",
    name: "GitHub Copilot",
    plans: {
      individual: {
        planId: "individual",
        name: "Individual",
        price: 10,
        billing: "monthly",
      },
      business: {
        planId: "business",
        name: "Business",
        price: 19,
        billing: "monthly",
      },
    },
    alternatives: {},
  },
  "openai-api": {
    toolId: "openai-api",
    name: "OpenAI API",
    plans: {
      direct: {
        planId: "direct",
        name: "Direct",
        price: 0,
        billing: "monthly",
      },
    },
    alternatives: {},
  },
  "anthropic-api": {
    toolId: "anthropic-api",
    name: "Anthropic API",
    plans: {
      direct: {
        planId: "direct",
        name: "Direct",
        price: 0,
        billing: "monthly",
      },
    },
    alternatives: {},
  },
  gemini: {
    toolId: "gemini",
    name: "Gemini",
    plans: {
      free: { planId: "free", name: "Free", price: 0, billing: "free" },
      pro: { planId: "pro", name: "Pro", price: 20, billing: "monthly" },
    },
    alternatives: {
      coding: "cursor",
      writing: "chatgpt",
    },
  },
  windsurf: {
    toolId: "windsurf",
    name: "Windsurf",
    plans: {
      free: { planId: 'free', name: 'Free', price: 0, billing: 'free' },
      pro: { planId: 'pro', name: 'Pro', price: 20, billing: 'monthly' },
    },
    alternatives: {},
  },
};
