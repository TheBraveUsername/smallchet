const WebSocket = require("ws");
const http = require("http");
const fs = require("fs").promises;

const PORT = 10000;
const HOST = '0.0.0.0';

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url === '/index.html') {
      const html = await fs.readFile('index.html', 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('File error:', error);
    res.writeHead(500);
    res.end('Server Error');
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



