const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    } // allow only localhost:3000 to connect and only allow GET and POST requests
});

app.use(cors());

io.on('connection', (socket) => { // listen for connection event
    console.log('A user connected');

    socket.on('join conversation', ({ userId, friendId }) => {
        const room = [userId, friendId].sort().join('-');
        socket.join(room);
    });

    socket.on('send message', (message) => {
        const room = [message.sender_id, message.receiver_id].sort().join('-'); // sort the user ids and join them with a hyphen
        io.to(room).emit('new message', message); // send the message to the room
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));