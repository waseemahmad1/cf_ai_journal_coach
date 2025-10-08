export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/chat") {
      const { message } = await request.json();

      // Get last 5 messages from KV for context
      const prev = (await env.JOURNAL_HISTORY.get("history")) || "[]";
      const history = JSON.parse(prev);
      history.push({ role: "user", content: message });
      if (history.length > 5) history.shift();

      // Query Llama 3.3 on Workers AI
      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "You are a supportive journaling coach helping users reflect on their day." },
            ...history
          ],
        }
      );

      const reply = aiResponse.response;
      history.push({ role: "assistant", content: reply });

      await env.JOURNAL_HISTORY.put("history", JSON.stringify(history));

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("AI Journal Coach running.");
  },
};
