# cf_ai_journal_coach

An AI-powered journaling coach built on Cloudflare Workers AI.

## 💡 Features
- Uses Llama 3.3 on Workers AI for conversation
- Maintains short-term memory using KV storage
- Simple chat interface via Cloudflare Pages

## 🚀 Deploy
```bash
npm install -g wrangler
wrangler init cf_ai_journal_coach
wrangler kv:namespace create JOURNAL_HISTORY
wrangler deploy
