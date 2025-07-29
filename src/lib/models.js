export const allTextModels = [
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', tier: 'basic', credits: 1 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', tier: 'basic', credits: 1 },
  { id: 'claude-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', tier: 'plus', credits: 2 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', tier: 'plus', credits: 3 },
  { id: 'claude-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', tier: 'premium', credits: 5 },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'premium', credits: 8 },
  { id: 'claude-opus', name: 'Claude 3 Opus', provider: 'Anthropic', tier: 'ultra', credits: 15 },
];

export const allImageModels = [
  { id: 'dall-e-2', name: 'DALL-E 2', provider: 'OpenAI', tier: 'premium', credits: 5 },
  { id: 'sdxl', name: 'Stability AI SDXL', provider: 'Stability', tier: 'premium', credits: 4 },
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', tier: 'ultra', credits: 10 },
  { id: 'midjourney', name: 'Midjourney', provider: 'Midjourney', tier: 'ultra', credits: 12 },
];

export const allVideoModels = [
    { id: 'runway', name: 'Runway Gen-2', provider: 'Runway', tier: 'ultra', credits: 25 },
    { id: 'pika', name: 'Pika Labs', provider: 'Pika', tier: 'ultra', credits: 20 },
];

export const tierLevels = { basic: 0, plus: 1, premium: 2, ultra: 3 };
