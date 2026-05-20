const http = require("http");
const https = require("https");

http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/claude") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const data = JSON.stringify(JSON.parse(body));
        const options = {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "mcp-client-2025-04-04"
          }
        };
        const apiReq = https.request(options, apiRes => {
          let response = "";
          apiRes.on("data", chunk => { response += chunk; });
          apiRes.on("end", () => {
            res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
            res.end(response);
            console.log("Done, status:", apiRes.statusCode);
          });
        });
        apiReq.on("error", err => {
          console.error("Error:", err.message);
          res.writeHead(500);
          res.end(JSON.stringify({ error: err.message }));
        });
        apiReq.write(data);
        apiReq.end();
      } catch(e) {
        console.error("Parse error:", e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3001, () => console.log("Proxy running on http://localhost:3001"));