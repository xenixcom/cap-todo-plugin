const { WebSocketServer } = require('ws');

const port = Number(process.env.WS_PORT || 41728);
const server = new WebSocketServer({ port });

server.on('connection', (socket) => {
  let idleTimer = null;

  const armIdleTimer = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(() => {
      if (socket.readyState === socket.OPEN) {
        socket.close(1000, 'idle-timeout');
      }
    }, 250);
  };

  socket.on('message', (raw) => {
    try {
      const payload = JSON.parse(String(raw));
      const result = payload.a + payload.b;
      socket.send(JSON.stringify({ result }));
      armIdleTimer();
    } catch (error) {
      socket.send(JSON.stringify({ error: String(error?.message ?? error) }));
    }
  });

  socket.on('close', () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
  });
});

console.log(`lab31 ws stub listening on ${port}`);
