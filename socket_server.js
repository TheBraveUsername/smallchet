const WebSocket = require("ws");
const http = require("http");

// Обязательно для Render!
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';  // НЕ localhost!

const server = http.createServer((req, res) => {
  // Обслуживаем index.html
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('index.html', 'utf8'));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected!");
  ws.send(JSON.stringify({ username: "Сервер", text: "Вы успешно подключились!" }));

  ws.on("message", (msg) => {
    try {
      const messageData = JSON.parse(msg.toString());
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    } catch (e) {
      console.error('Parse error:', e);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
