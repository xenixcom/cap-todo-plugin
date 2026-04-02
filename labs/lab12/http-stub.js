const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.url !== "/ping") {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify({ error: "not found" }));
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify({ ok: true, from: "lab12" }));
});

server.listen(41727, "0.0.0.0", () => {
  console.log("LAB12_HTTP_STUB_READY=41727");
});
