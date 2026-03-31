export async function generateGeminiSummary(params: {
  address: string;
  totalValue: number | null;
  primaryChain: string | null;
  personas: string[];
  dailyChange: number | null;
  dailyPercent: number | null;
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const {
    address,
    totalValue,
    primaryChain,
    personas,
    dailyChange,
    dailyPercent,
  } = params;

  const prompt = `
You are a professional crypto wallet analyst.

You MUST only use the provided data. Do NOT make up any information.

Wallet profile:
- Wallet address: ${address}
- Total value (USD): ${totalValue ?? "unknown"}
- Personas: ${personas.length ? personas.join(", ") : "none"}
- Primary chain: ${primaryChain ?? "unknown"}
- 24h change: ${dailyChange ?? "unknown"} (${dailyPercent ?? "unknown"}%)

Write a concise 3-sentence analysis.

Focus on:
1. Wallet scale
2. Wallet behavior
3. Chain preference

Keep it factual, concise, and product-style.
`.trim();

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || "Gemini request failed");
  }

  return (
    json?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No Gemini summary returned."
  );
}