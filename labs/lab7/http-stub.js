const http = require("node:http");
const url = require("node:url");

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname !== "/sum") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const a = Number(parsed.query.a ?? 0);
  const b = Number(parsed.query.b ?? 0);

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify({ result: a + b }));
});

server.listen(41707, "0.0.0.0", () => {
  console.log("LAB7_HTTP_STUB_READY=41707");
});
