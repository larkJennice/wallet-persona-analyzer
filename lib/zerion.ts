async function zerionFetch(url: string, retries = 3) {
  const apiKey = process.env.ZERION_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ZERION_API_KEY");
  }

  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      return res.json();
    }

    if (res.status === 429 && attempt < retries) {
      const reset = res.headers.get("RateLimit-Org-Second-Reset");
      const waitMs = Math.max(1000, Number(reset || "1") * 1000);

      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    const text = await res.text();
    throw new Error(`Zerion request failed: ${res.status} ${text}`);
  }

  throw new Error("Unexpected Zerion fetch failure");
}

export async function fetchWalletPortfolio(address: string) {
  const url = `https://api.zerion.io/v1/wallets/${address}/portfolio`;
  return zerionFetch(url);
}

export async function fetchWalletDefiPositions(address: string) {
  const url =
    `https://api.zerion.io/v1/wallets/${address}/positions/` +
    `?currency=usd&filter[positions]=only_complex&sort=-value`;

  return zerionFetch(url);
}