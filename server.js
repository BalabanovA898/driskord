var path = require("path");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var PORT = 3001;

io.on("connection", socket => {
    console.log("Socket connected");
});

server.listen(PORT, function () {
    console.log("Server started");
});
