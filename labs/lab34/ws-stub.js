const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ host: "0.0.0.0", port: 41734 });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    try {
      const payload = JSON.parse(String(raw));
      if (payload.caseId === "malformed_frame") {
        socket.send("{not-json");
        return;
      }
      socket.send(JSON.stringify({ result: Number(payload.a) + Number(payload.b) }));
    } catch (error) {
      socket.send(JSON.stringify({ error: String(error) }));
    }
  });
});

wss.on("listening", () => {
  console.log("LAB34_WS_STUB_READY=41734");
});
