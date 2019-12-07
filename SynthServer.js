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



// hook up socketio with the server
const io = socketio(server);

// a user joined our site
io.on("connection", socket => {
  socket.on('updateType', (type) => {
    console.log(type);
    io.emit('typeUpdated', type);
  })

  socket.on('updateDetune', (detune )=> {
    console.log(detune);
    io.emit('detuneUpdated',detune);
   } )
  

  // when a user leaves the site...
  socket.on("disconnect", () => {
    
  });
});

// -------- End of Custom Server Code -------- //

// Start listening on a standard port
const port = process.env.PORT || 3001;
server.listen(port, () => {
  // Print to console just so we know its ready to go...
  console.log("Server listening on http://localhost:" + port);
});