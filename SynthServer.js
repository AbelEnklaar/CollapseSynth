//SynthServer based on the socket io setup used by Matt Deslauriers in his code demo.

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

// a user joined the server
io.on("connection", socket => {

socket.on("oscActive", (state) => {
  console.log("oscillator module: ", state),
  io.emit("oscillatorActive", state);
})

socket.on("filterActive", (state) =>{
  console.log("filter module: ", state);
  io.emit("filterActive", state);
})

socket.on("partialActive", (state) => {
  console.log("partial module: ", state);
  io.emit("partialActive", state);
})

socket.on("reverbActive", (state) => {
  console.log("reverb module: ", state);
  io.emit("reverbActive", state);
})

  socket.on("updateType", (type) => {
    console.log("waveform : ", type);
    io.emit("typeUpdated", type);
  })

  socket.on("updateDetune", (detune) => {
    console.log("detune amount : ", detune);
    io.emit("detuneUpdated", detune);
  })

  socket.on("updatePartial1", (partial1Amount) => {
    console.log("partial 1 : ", partial1Amount);
    io.emit("partial1Updated", partial1Amount);
  })
  socket.on("updatePartial2", (partial2Amount) => {
    console.log("partial 2 : ", partial2Amount);
    io.emit("partial2Updated", partial2Amount);
  })

  socket.on("updateRoomSize", (roomSize) => {
    console.log("Roomsize : ", roomSize);
    io.emit("roomSizeUpdated", roomSize);
  })

  socket.on("updateDampening", (dampening) => {
    console.log("Dampening : ", dampening);
    io.emit("dampeningUpdated", dampening);
  })
  // when a user leaves the site...
  socket.on("disconnect", () => {
  });
});
// -------- End of Custom Server Code -------- //

// Start listening on a standard port
const port = process.env.PORT || 42069;
server.listen(port, () => {
  // Print to console just so we know its ready to go...
  console.log("Server listening on http://localhost:" + port);
});