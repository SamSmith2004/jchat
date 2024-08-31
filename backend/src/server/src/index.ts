import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') }); 

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
    origin: ["http://localhost:3000", "https://localhost:8080"],
    methods: ["GET", "POST"]
  }
});
const redis_host = process.env.REDIS_HOST;

if (!redis_host) {
  console.error('REDIS_HOST is not set in the environment variables');
  process.exit(1);
}

const redis = new Redis({
  host: redis_host,
  port: 30036
});

redis.on('connect', async () => {
  console.log('Connected to Redis');
  // Clear online users on server start
  await redis.del('online_users');
});

redis.on('error', (err) => console.error('Redis connection error:', err));

app.use(cors());
app.use(express.json());

// User status namespace
const userStatus = io.of('/user-status');
userStatus.on('connection', (socket: CustomSocket) => {
  const userId = socket.user?.id;
  if (userId) {
    redis.set(`user:${userId}:status`, 'online', 'EX', 60); // Set user status to online for 60 seconds
    userStatus.emit('user_online', userId); // Notify all clients that user is online
  }
  socket.on('disconnect', async () => {
    if (userId) {
      await redis.del(`user:${userId}:status`);
      userStatus.emit('user_offline', userId);
    }
  });
});

app.post('/api/user-status', async (req, res) => {
  const { userId, status } = req.body;
  if (status === 'online') {
    await redis.set(`user:${userId}:status`, 'online', 'EX', 60);
    userStatus.emit('user_online', userId);
  } else if (status === 'offline') {
    await redis.del(`user:${userId}:status`);
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
    const timestamp = new Date().toISOString();
    const room = [message.sender_id, message.receiver_id].sort().join('-');
    const newMessage = { ...message, timestamp };
    messaging.to(room).emit('new_message', newMessage);

    // Emit a notification to the receiver
    notifications.to(message.receiver_id.toString()).emit('new_notification', {
      id: Date.now(), // might want to use a proper ID from database
      senderId: message.sender_id,
      content: `New message from ${message.sender_name}`,
      sender_name: message.sender_name,
      timestamp: timestamp,
      sender_id: message.sender_id
    });
  });
});

// Notifications namespace
const notifications = io.of('/notifications');
notifications.on('connection', (socket: CustomSocket) => {
  socket.on('join_notifications', (userId) => {
    socket.join(userId.toString());
  });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export { io };