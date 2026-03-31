"use client";

type WalletAnalyzerFormProps = {
  addressInput: string;
  loading: boolean;
  onAddressChange: (value: string) => void;
  onSubmit: () => void;
};

export default function WalletAnalyzerForm({
  addressInput,
  loading,
  onAddressChange,
  onSubmit,
}: WalletAnalyzerFormProps) {
  return (
    <section className="border rounded-xl p-4 max-w-3xl">
      <h2 className="font-semibold mb-3">Analyze Wallet</h2>

      <div className="space-y-3">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Enter wallet address, e.g. 0x..."
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="border rounded-lg px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </section>
  );
}