// Require some modules
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

// setup an express app
const app = express();

// setup a server
const server = http.createServer(app);

// Serve the current directory as a static website
// This allows us to use HTML, JavaScript, etc
app.use(express.static(__dirname));

// -------- Start of Custom Server Code -------- //

// hook up socketio with the server
const io = socketio.listen(server);

// number of active users
let count = 0;

// a user joined our site
io.on("connection", socket => {
  // increase count by 1
  count++;

  // tell all users the new count
  io.emit("count", count);

  // when a user leaves the site...
  socket.on("disconnect", () => {
    // then we reduce the count by 1
    count--;

    // and tell the new count to the user
    io.emit("count", count);
  });
});

// -------- End of Custom Server Code -------- //

// Start listening on a standard port
const port = process.env.PORT || 3000;
server.listen(port, () => {
  // Print to console just so we know its ready to go...
  console.log("Server listening on http://localhost:" + port);
});