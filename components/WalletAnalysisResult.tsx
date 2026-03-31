import { AnalyzeApiResponse } from "@/types/wallet";

type WalletAnalysisResultProps = {
  loading: boolean;
  data: AnalyzeApiResponse | null;
};

export default function WalletAnalysisResult({
  loading,
  data,
}: WalletAnalysisResultProps) {
  if (loading) {
    return <p className="mt-4">Loading...</p>;
  }

  if (data?.ok === false) {
    return <p className="text-red-600 mt-4">{data.error}</p>;
  }

  if (!data?.ok || !data.result) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 max-w-3xl">
      <div>
        <div className="text-sm text-gray-500">Address</div>
        <div className="break-all">{data.result.address}</div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Total Value</div>
        <div>
          {data.result.totalValue !== null
            ? `$${data.result.totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`
            : "N/A"}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Primary Chain</div>
        <div>{data.result.primaryChain ?? "Unknown"}</div>
      </div>

      <div>
        <div className="text-sm text-gray-500">24h Change</div>
        <div>
          {data.result.dailyChange != null && data.result.dailyPercent != null
            ? `$${data.result.dailyChange.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })} / ${data.result.dailyPercent.toFixed(2)}%`
            : "N/A"}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Personas</div>
        <div>
          {data.result.personas.length > 0
            ? data.result.personas.join(", ")
            : "None"}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Gemini Analysis</div>
        <div className="border rounded-lg p-3 bg-gray-50 whitespace-pre-wrap">
          {data.result.aiSummary}
        </div>
      </div>
    </div>
  );
}