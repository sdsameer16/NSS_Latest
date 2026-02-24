const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Log environment status (without sensitive data)
console.log('\n🔧 Environment Configuration:');
console.log(`   MongoDB URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'}`);
console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`   Brevo API Key: ${process.env.BREVO_API_KEY ? '✅ Set (***' + process.env.BREVO_API_KEY.slice(-4) + ')' : '⚠️ Not set (emails disabled)'}`);
console.log(`   Brevo Sender: ${process.env.BREVO_SENDER_EMAIL ? '✅ ' + process.env.BREVO_SENDER_EMAIL : '⚠️ Not set'}`);
console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
console.log('');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "https://localhost:3000",
      "https://nss-latest.onrender.com",
      "https://nss-portal-backend.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (for local storage fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/participations', require('./routes/participations'));
app.use('/api/contributions', require('./routes/contributions'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/notifications-api', require('./routes/notifications'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    socketio: 'running'
  });
});

app.use('/api/notifications-api', require('./routes/notifications-api'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/ai-assistant', require('./routes/aiAssistant'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/period-config', require('./routes/periodConfig'));
app.use('/api/od-list', require('./routes/odList'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nss-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NSS Activity Portal API is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New WebSocket connection:', socket.id);
  console.log(`   Total connected clients: ${io.engine.clientsCount}`);

  // Join user's personal room based on userId
  socket.on('join-user-room', (userId) => {
    const roomName = `user-${userId}`;
    socket.join(roomName);
    console.log(`👤 User ${userId} joined room: ${roomName}`);
    
    // Send confirmation
    socket.emit('room-joined', { room: roomName, userId });
  });

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    console.log(`🔌 WebSocket disconnected: ${socket.id}, reason: ${reason}`);
    console.log(`   Remaining connected clients: ${io.engine.clientsCount}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  // Debug: Log all events
  socket.onAny((event, ...args) => {
    console.log(`📡 Socket event: ${event}`, args);
  });
});

// Initialize certificate scheduler
const { initializeCertificateScheduler } = require('./utils/certificateScheduler');
initializeCertificateScheduler(io);

// Initialize notification cleanup scheduler
const Notification = require('./models/Notification');
const cron = require('node-cron');

// Run notification cleanup every hour
cron.schedule('0 * * * *', async () => {
  console.log('🧹 Running notification cleanup job...');
  await Notification.cleanupExpiredEventNotifications();
});

console.log('✅ Notification cleanup scheduler initialized (runs every hour)');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server initialized`);
});

