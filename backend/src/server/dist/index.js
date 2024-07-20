"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    } // allow only localhost:3000 to connect and only allow GET and POST requests
});
app.use((0, cors_1.default)());
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('join conversation', ({ userId, friendId }) => {
        const room = [userId, friendId].sort().join('-');
        socket.join(room);
    });
    socket.on('send message', (message) => {
        const room = [message.sender_id, message.receiver_id].sort().join('-'); // sort the user ids and join them with a hyphen
        io.to(room).emit('new message', message);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map