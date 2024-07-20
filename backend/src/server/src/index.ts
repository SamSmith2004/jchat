import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import Redis from 'ioredis';

interface CustomSocket extends Socket {
    user?: {
        id: number;
        email: string;
        username: string;
    }
}
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    } // allow only localhost:3000 to connect and only allow GET and POST requests
});
const redis = new Redis({
        host: '100.106.217.25',
        port: 30036
    });

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis connection error:', err));

app.use(cors());
app.use(express.json());

// User status namespace
const userStatus = io.of('/user-status');
userStatus.on('connection', (socket : CustomSocket) => { // socket is the connection object
    const userId = socket.user?.id;
    // Set user as online
    redis.sadd('online_users', userId);
    userStatus.emit('user_online', userId);
    socket.on('disconnect', async () => {
        // Set user as offline
        await redis.srem('online_users', userId);
        userStatus.emit('user_offline', userId);
    });
});

app.post('/api/user-status', async (req, res) => {
    const { userId, status } = req.body;
    if (status === 'online') {
      await redis.sadd('online_users', userId);
      userStatus.emit('user_online', userId);
    } else if (status === 'offline') {
      await redis.srem('online_users', userId);
      userStatus.emit('user_offline', userId);
    }
    res.status(200).json({ message: 'Status updated successfully' });
});

// Messaging namespace
const messaging = io.of('/messaging');
messaging.on('connection', (socket: Socket) => {
    socket.on('join_conversation', ({ userId, friendId }) => {
        const room = [userId, friendId].sort().join('-');
        socket.join(room);
    });
    socket.on('send_message', (message) => {
        const room = [message.sender_id, message.receiver_id].sort().join('-');
        messaging.to(room).emit('new_message', message);
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));