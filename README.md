# cf_ai_journal_coach

An AI-powered journaling coach built with **Cloudflare Workers AI**, **KV Storage**, and **Pages**. This was developed for Cloudfare SWE Intern 2026!

---

## What It Does
- Lets users chat with an AI journaling coach.
- Uses **Llama 3.3** via Workers AI for responses.
- Stores short-term memory in **KV** for continuity.
- Frontend built with HTML + JS and hosted on **Cloudflare Pages**.

---

## How to Deploy

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/cf_ai_journal_coach.git
cd cf_ai_journal_coach

### 2. Set up Cloudflare
```bash
npm install -g wrangler
wrangler login
wrangler kv namespace create JOURNAL_HISTORY
wrangler kv namespace create JOURNAL_HISTORY --preview
```

Update `wrangler.toml` with the generated `id` and `preview_id`.

### 3. Deploy the Worker
```bash
wrangler deploy
```

Test it:
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"message":"I had a busy day"}' \
https://cf_ai_journal_coach.<yourname>.workers.dev/chat
```

### 4. Deploy the Frontend (Pages)
1. Go to Cloudflare Dashboard → Workers & Pages → Pages → Create Project
2. Connect your GitHub repo
3. Leave Build command blank
4. Set Output directory to `/`
5. Deploy — you'll get a Pages URL like: `https://cf-ai-journal-coach.pages.dev`

### 5. Connect Frontend to Worker
In `index.html`, update:
```js
const WORKER_URL = "https://cf_ai_journal_coach.<yourname>.workers.dev/chat";
```

Push your changes to GitHub.

---

## Example URLs
- Worker: https://cf_ai_journal_coach.waseemahmad.workers.dev
- Frontend: https://cf-ai-journal-coach.pages.dev
