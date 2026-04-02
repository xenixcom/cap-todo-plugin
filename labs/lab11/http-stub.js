const http = require("node:http");
const url = require("node:url");

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname !== "/sum") {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  const mode = String(parsed.query.mode ?? "ok");
  const a = Number(parsed.query.a ?? 0);
  const b = Number(parsed.query.b ?? 0);

  if (mode === "timeout") {
    setTimeout(() => {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify({ result: a + b }));
    }, 1500);
    return;
  }

  if (mode === "malformed") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify({ nope: a + b }));
    return;
  }

  if (mode === "503") {
    res.writeHead(503, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify({ error: "upstream unavailable" }));
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify({ result: a + b }));
});

server.listen(41731, "0.0.0.0", () => {
  console.log("LAB11_HTTP_STUB_READY=41731");
});
