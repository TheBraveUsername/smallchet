const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8090 });

server.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send(JSON.stringify({ username: "Сервер", text: "Вы успешно подключились!" }));

  ws.on("message", (msg) => {
    console.log(`Client sent: ${msg}`);
    const messageData = JSON.parse(msg.toString());
    
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    });
  });
});