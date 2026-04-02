const { WebSocketServer } = require('ws');

const port = Number(process.env.WS_PORT || 41718);
const server = new WebSocketServer({ port });

server.on('connection', (socket) => {
  socket.on('message', (raw) => {
    try {
      const payload = JSON.parse(String(raw));
      const result = payload.a + payload.b;
      socket.send(JSON.stringify({ result }));

      if (!payload.keepAlive) {
        socket.close(1000, 'reconnect-required');
      }
    } catch (error) {
      socket.send(JSON.stringify({ error: String(error?.message ?? error) }));
    }
  });
});

console.log(`lab20 ws stub listening on ${port}`);
