const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8090;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send(JSON.stringify({ username: "Сервер", text: "Вы успешно подключились!" }));

  ws.on("message", (msg) => {
    const messageData = JSON.parse(msg.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    });
  });
});
