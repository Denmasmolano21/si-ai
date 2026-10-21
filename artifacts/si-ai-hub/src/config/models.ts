export type ModelPricingStatus = "unknown" | "free" | "paid";

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  pricingStatus: ModelPricingStatus;
  enabled: boolean;
};

/**
 * Demo catalog for the initial UI. Model names/IDs are examples only and are
 * not checked against OpenRouter. Prices remain unknown until verified from
 * the provider's current catalog.
 */
export const AI_MODELS: AIModel[] = [
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    pricingStatus: "unknown",
    enabled: true,
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    pricingStatus: "unknown",
    enabled: true,
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    pricingStatus: "unknown",
    enabled: true,
  },
];
