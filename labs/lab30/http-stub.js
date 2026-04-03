const http = require("node:http");
const url = require("node:url");

const counters = new Map();

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  };
}

function keyFor(parsed) {
  return `${parsed.query.case ?? "default"}:${parsed.query.mode ?? "ok"}`;
}

function increment(key) {
  const next = (counters.get(key) ?? 0) + 1;
  counters.set(key, next);
  return next;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === "/reset") {
    counters.clear();
    res.writeHead(200, corsHeaders());
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (parsed.pathname !== "/sum") {
    res.writeHead(404, corsHeaders());
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const mode = String(parsed.query.mode ?? "ok");
  const a = Number(parsed.query.a ?? 0);
  const b = Number(parsed.query.b ?? 0);
  const count = increment(keyFor(parsed));

  if (mode === "retry503" && count === 1) {
    res.writeHead(503, corsHeaders());
    res.end(JSON.stringify({ error: "transient unavailable", attempt: count }));
    return;
  }

  if (mode === "retryTimeout" && count === 1) {
    setTimeout(() => {
      res.writeHead(200, corsHeaders());
      res.end(JSON.stringify({ result: a + b, attempt: count }));
    }, 1500);
    return;
  }

  res.writeHead(200, corsHeaders());
  res.end(JSON.stringify({ result: a + b, attempt: count }));
});

server.listen(41739, "0.0.0.0", () => {
  console.log("LAB29_HTTP_STUB_READY=41739");
});
