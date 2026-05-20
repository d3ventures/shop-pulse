export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (body.mcp_servers) {
      body.mcp_servers = body.mcp_servers.map(s =>
        s.name === "euka-mcp"
          ? { ...s, authorization_token: "euka_mcp_8J3EBl9t3T3aTXvBhPgDteAE7UsaKfltKJVlZNFej7M" }
          : s
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("Anthropic status:", response.status);
    if (!response.ok) console.log("Error:", text.slice(0, 500));

    res.status(response.status).setHeader("Content-Type", "application/json").send(text);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
