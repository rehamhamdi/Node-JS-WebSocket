const Express = require("express");
const app = Express();
const server = app.listen(2000, () => {
  console.log("Server is running");
});

// get the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Create WebSocket server
const SocketServer = require("ws").Server;
const wss = new SocketServer({ server });
let users = []; // Shared list of users

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send the current list of users to the newly connected client
  ws.send(JSON.stringify(users));

  //messages from clients
  ws.on("message", (message) => {
    const user = JSON.parse(message); 
    users.push(user);

    // Broadcast updated user list to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(users));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});