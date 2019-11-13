const express = require("express");
const http = require("http");

const app = express(); 

app.use(express.static("public"));


app.get("/moduleState", (req, res) => {
    res.json({
        type: module.type,
        state: module.state,
        data: module.data
    });
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Listening on http://localhost:" + port);

});

