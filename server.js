var path = require("path");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const {version, validate} = require("uuid");


const ACTIONS = require("./src/socket/actions.js");

var PORT = 3001;

function getClientRooms () {
    const {rooms} = io.sockets.adapter;
    return Array.from(rooms.keys()).filter(item => validate(item) && version(item) === 4 );
}

function shareRoomsInfo() {
    io.emit(ACTIONS.SHARE_ROOMS, {
        rooms: getClientRooms(), 
    });
}

io.on("connection", socket => {
    shareRoomsInfo();
    socket.on(ACTIONS.JOIN, config => {
        const {room: roomID} = config;
        const {rooms: joinedRooms} = socket;

        if (Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`);
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        clients.forEach(id => {
            io.to(id).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false,
            })

            socket.emit(ACTIONS.ADD_PEER, {
                peerID: id,
                createOffer: true,
            })
        })

        socket.join(roomID);
        shareRoomsInfo();
    })
    
    function leaveRoom() {
        const {rooms} = socket;
    
        Array.from(rooms).forEach(room => {
            const clients = Array.from(io.sockets.adapter.rooms.get(room) || []);
            clients.forEach(clientID => {
                io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                    peerID: socket.id,
                });
    
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerID: clientID,
                })
            })
            socket.leave(room);
        })
        shareRoomsInfo();
    }
    
    socket.on(ACTIONS.LEAVE, leaveRoom);
    socket.on("disconnecting", leaveRoom);
});

server.listen(PORT, function () {
    console.log("Server started");
});
