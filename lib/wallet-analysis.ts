export type PortfolioAttributes = {
  total?: {
    positions?: number;
  };
  positions_distribution_by_chain?: Record<string, number>;
  changes?: {
    absolute_1d?: number;
    percent_1d?: number;
  };
};

export function extractPortfolioAttributes(
  payload: unknown
): PortfolioAttributes | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const p = payload as {
    portfolio?: {
      data?: {
        attributes?: PortfolioAttributes;
      };
    };
    data?: {
      attributes?: PortfolioAttributes;
    };
  };

  return p.portfolio?.data?.attributes ?? p.data?.attributes ?? null;
}

export function getPrimaryChain(
  chainDistribution: Record<string, number> | undefined
): string | null {
  if (!chainDistribution) return null;

  let topChain: string | null = null;
  let topValue = -Infinity;

  for (const [chain, value] of Object.entries(chainDistribution)) {
    if (typeof value === "number" && value > topValue) {
      topValue = value;
      topChain = chain;
    }
  }

  return topChain;
}

export function buildPersonas(params: {
  totalValue: number;
  chainDistribution?: Record<string, number>;
}): string[] {
  const personas: string[] = [];
  const { totalValue, chainDistribution = {} } = params;

  if (totalValue > 1_000_000) {
    personas.push("Whale");
  } else if (totalValue > 100_000) {
    personas.push("High Net Worth");
  } else {
    personas.push("Retail");
  }

  const activeChains = Object.entries(chainDistribution).filter(
    ([, value]) => typeof value === "number" && value > 10
  );

  if (activeChains.length >= 3) {
    personas.push("Cross-chain");
  }

  const primaryChain = getPrimaryChain(chainDistribution);
  if (primaryChain) {
    personas.push(`${primaryChain}-heavy`);
  }

  const nonZeroChains = Object.values(chainDistribution).filter(
    (value) => typeof value === "number" && value > 0
  ).length;

  const tinyChains = Object.values(chainDistribution).filter(
    (value) => typeof value === "number" && value > 0 && value < 20
  ).length;

  if (nonZeroChains >= 5 && tinyChains >= 2) {
    personas.push("Explorer");
  }

  return personas;
}

export function buildFallbackSummary(params: {
  totalValue: number | null;
  primaryChain: string | null;
  personas: string[];
  dailyChange: number | null;
  dailyPercent: number | null;
}) {
  const { totalValue, primaryChain, personas, dailyChange, dailyPercent } = params;

  if (totalValue === null) {
    return "Unable to determine a wallet summary from the current Zerion response.";
  }

  const changeText =
    dailyChange !== null && dailyPercent !== null
      ? ` Over the last 24 hours, it changed by $${dailyChange.toLocaleString(
          undefined,
          { maximumFractionDigits: 2 }
        )} (${dailyPercent.toFixed(2)}%).`
      : "";

  return `This wallet holds about $${totalValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} in assets. Its largest allocation is on ${
    primaryChain ?? "an unknown chain"
  }, and its current profile suggests ${
    personas.length ? personas.join(", ") : "unclear"
  } behavior.${changeText}`;
}