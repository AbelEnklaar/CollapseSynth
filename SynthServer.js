// require modules
const http = require('http');
const express = require("express");

// create an application
const app = express();

// when user visits /api
app.get('/api', (req, res) => {
  const data = {
    oscillator : {
        state: true,
        type: 0.5,
        frequency: 0.4  
    },
    delay : {
        wet: 0.5,
        dry: 0.5
    }
  };
  res.send(data);
});

// setup a server
const server = http.createServer(app);

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server listening on http://localhost:" + port);
});
