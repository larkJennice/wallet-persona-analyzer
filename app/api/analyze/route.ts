import { NextRequest, NextResponse } from "next/server";
import { fetchWalletPortfolio } from "@/lib/zerion";
import { generateGeminiSummary } from "@/lib/gemini";
import { extractPortfolioAttributes, getPrimaryChain, buildPersonas, buildFallbackSummary } from "@/lib/wallet-analysis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address = body.address?.trim();

    if (!address) {
      return NextResponse.json(
        { ok: false, error: "Missing wallet address" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { ok: false, error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    const portfolio = await fetchWalletPortfolio(address);
    const attrs = extractPortfolioAttributes(portfolio);

    if (!attrs) {
      return NextResponse.json(
        {
          ok: false,
          error: "Could not extract portfolio attributes from Zerion response",
          raw: { portfolio },
        },
        { status: 500 }
      );
    }

    const totalValue =
      typeof attrs?.total?.positions === "number"
        ? attrs.total.positions
        : null;

    const chainDistribution =
      attrs?.positions_distribution_by_chain &&
      typeof attrs.positions_distribution_by_chain === "object"
        ? (attrs.positions_distribution_by_chain as Record<string, number>)
        : undefined;

    const primaryChain = getPrimaryChain(chainDistribution);

    const dailyChange =
      typeof attrs?.changes?.absolute_1d === "number"
        ? attrs.changes.absolute_1d
        : null;

    const dailyPercent =
      typeof attrs?.changes?.percent_1d === "number"
        ? attrs.changes.percent_1d
        : null;

    const personas =
      totalValue !== null
        ? buildPersonas({
            totalValue,
            chainDistribution,
          })
        : [];

    const fallbackSummary = buildFallbackSummary({
      totalValue,
      primaryChain,
      personas,
      dailyChange,
      dailyPercent,
    });

    let aiSummary = fallbackSummary;

    if (process.env.GEMINI_API_KEY) {
      try {
        aiSummary = await generateGeminiSummary({
          address,
          totalValue,
          primaryChain,
          personas,
          dailyChange,
          dailyPercent,
        });
      } catch (geminiError) {
        console.error("Gemini summary failed, using fallback:", geminiError);
      }
    }

    return NextResponse.json({
      ok: true,
      result: {
        address,
        totalValue,
        personas,
        primaryChain,
        aiSummary,
        dailyChange,
        dailyPercent,
      },
      raw: {
        portfolio,
      },
    });
  } catch (error) {
    // console.error("API /api/analyze error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}