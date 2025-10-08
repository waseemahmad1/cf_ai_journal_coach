const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

// --- Constants ---
const MAX_MESSAGES = 6; // keep short-term memory window

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    if (request.method === "POST" && url.pathname === "/reset") {
      await env.JOURNAL_HISTORY.delete("history");
      return new Response(JSON.stringify({ ok: true, message: "Memory cleared" }), {
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      try {
        const { message } = await request.json();
        if (!message || message.trim().length === 0) {
          return new Response(JSON.stringify({ error: "Message cannot be empty." }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        }

        // Retrieve history
        const prev = (await env.JOURNAL_HISTORY.get("history")) || "[]";
        const history = JSON.parse(prev);
        history.push({ role: "user", content: message });
        if (history.length > MAX_MESSAGES) history.shift();

        // Call Workers AI (Llama 3.3 model)
        const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
          messages: [
            {
              role: "system",
              content:
                "You are a supportive journaling coach who helps users reflect on their day. Be kind, concise, and ask one follow-up question to encourage reflection.",
            },
            ...history,
          ],
        });

        const reply = aiResponse?.response || "I'm here for you — tell me more.";

        // Save updated history to KV
        history.push({ role: "assistant", content: reply });
        await env.JOURNAL_HISTORY.put("history", JSON.stringify(history));

        return new Response(JSON.stringify({ reply }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      }
    }

    return new Response("AI Journal Coach Worker active.", { headers: CORS });
  },
};
