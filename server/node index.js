const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

// create HTTP server
const server = http.createServer();

// attach WebSocket to server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // broadcast
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

// start server
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
