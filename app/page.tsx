"use client";

import { useState } from "react";
import WalletAnalyzerForm from "@/components/WalletAnalyzerForm";
import WalletAnalysisResult from "@/components/WalletAnalysisResult";
import { AnalyzeApiResponse } from "@/types/wallet";

export default function HomePage() {
  const [addressInput, setAddressInput] = useState("");
  const [data, setData] = useState<AnalyzeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeWallet() {
    const address = addressInput.trim();
    // console.log("Analyze clicked:", address);

    if (!address) {
      setData({
        ok: false,
        error: "Please enter a wallet address.",
      });
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const json = await res.json();
      // console.log("API response:", json);
      setData(json);
    } catch (error) {
      // console.error(error);
      setData({
        ok: false,
        error: error instanceof Error ? error.message : "Request failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-2">Wallet Persona Analyzer</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter a wallet address to generate a Zerion-based profile and Gemini summary.
      </p>

      <WalletAnalyzerForm
        addressInput={addressInput}
        loading={loading}
        onAddressChange={setAddressInput}
        onSubmit={analyzeWallet}
      />

      <WalletAnalysisResult loading={loading} data={data} />
    </main>
  );
}