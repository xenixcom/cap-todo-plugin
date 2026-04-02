const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ host: "0.0.0.0", port: 41708 });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    try {
      const payload = JSON.parse(String(raw));
      socket.send(JSON.stringify({ result: Number(payload.a) + Number(payload.b) }));
    } catch (error) {
      socket.send(JSON.stringify({ error: String(error) }));
    }
  });
});

wss.on("listening", () => {
  console.log("LAB8_WS_STUB_READY=41708");
});
