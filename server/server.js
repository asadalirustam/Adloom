const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/creators', require('./routes/creatorRoutes'));
app.use('/api/requirements', require('./routes/requirementRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    appName: 'Adloom API',
    timestamp: new Date(),
  });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Socket.io Realtime Management
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  // User connects with their userId
  socket.on('setup', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }
  });

  // Join a specific chat room
  socket.on('join_chat', (room) => {
    socket.join(room);
  });

  // Typing indicator
  socket.on('typing', ({ room, senderName }) => {
    socket.to(room).emit('typing', senderName);
  });

  socket.on('stop_typing', (room) => {
    socket.to(room).emit('stop_typing');
  });

  // New message notification
  socket.on('send_message', (messageData) => {
    if (messageData.conversation) {
      socket.to(messageData.conversation).emit('message_received', messageData);
    }
    if (messageData.recipient) {
      socket.to(messageData.recipient).emit('new_message_notification', messageData);
    }
  });

  // Realtime notification push
  socket.on('send_notification', ({ recipientId, notification }) => {
    if (recipientId) {
      socket.to(recipientId).emit('notification_received', notification);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Adloom API] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
