const http = require("node:http");
const url = require("node:url");

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname !== "/sum") {
    res.writeHead(404, corsHeaders());
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const a = Number(parsed.query.a ?? 0);
  const b = Number(parsed.query.b ?? 0);
  res.writeHead(200, corsHeaders());
  res.end(JSON.stringify({ result: a + b, source: "fallback" }));
});

server.listen(41741, "0.0.0.0", () => {
  console.log("LAB33_HTTP_STUB_READY=41741");
});
