# Wallet Persona Analyzer

Analyze any crypto wallet and generate structured insights and human-readable summaries using on-chain data and LLMs.

Live Demo: https://wallet-persona-analyzer.vercel.app

> Built during Silly Hackathon as a rapid prototype exploring on-chain wallet analysis and AI-generated insights.

---

## ✨ Features

- 🔍 Analyze wallet portfolios via Zerion API
- 🧠 Generate natural-language summaries using Gemini
- 📊 Extract key signals:
  - Total portfolio value
  - Chain distribution
  - Daily change (absolute + %)
- 🧩 Fallback summary logic when AI is unavailable
- ⚡ Built with Next.js App Router and serverless API routes

---

## 🛠 Tech Stack

- Next.js (App Router)
- TypeScript
- Vercel (deployment)
- Zerion API (wallet data)
- Gemini API (LLM-based summary)

---

## 🧪 Local Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/larkJennice/wallet-persona-analyzer.git
cd wallet-persona-analyzer
npm install
```
Create a `.env.local` file in the project root:
```bash
ZERION_API_KEY=your_zerion_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📦 Available Scripts
```bash
npm run dev      # start local development server
npm run build    # build for production
npm run start    # start production server
npm run lint     # run ESLint
```

---

## API Reference

- Zerion Wallet Portfolio API: https://developers.zerion.io/api-reference/wallets/get-wallet-portfolio

