require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./config/db.config');
const { weddingSequelize } = require('./config/wedding_db.config');
const pegawaiRoutes = require('./routes/pegawai.routes');
const weddingRoutes = require('./routes/wedding.routes');
const authRoutes = require('./routes/auth.routes');
const pensiunRoutes = require('./routes/pensiun.routes');
const jenisPensiunRoutes = require('./routes/jenis_pensiun.routes');

const app = express();

// Environment Configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Log current environment
console.log(`Server running in ${NODE_ENV} mode`);

// CORS handling for all environments
console.log('Setting up CORS handling');

// Define allowed origins based on environment
const allowedOrigins = isDevelopment
  ? process.env.DEV_DOMAINS.split(',')
  : [
      process.env.PROD_PEGAWAI_DOMAIN,
      process.env.PROD_WEDDING_DOMAIN
    ].filter(Boolean);

// Explicitly add sasak.merariq.info to allowed origins
if (!allowedOrigins.includes('https://sasak.merariq.info')) {
  allowedOrigins.push('https://sasak.merariq.info');
}

console.log('Allowed origins:', allowedOrigins);

// Add specific routes to handle the problematic endpoint
app.options('/api/wedding/guests/:slug/attendance', (req, res) => {
  console.log('Handling OPTIONS request for attendance endpoint');

  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Respond with 200 OK
  res.status(200).end();
});

// Add a direct route handler for the attendance endpoint
const guestController = require('./controllers/guest.controller');
app.put('/api/wedding/guests/:slug/attendance', (req, res, next) => {
  console.log('Direct PUT handler for attendance endpoint');
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Pass to the controller
  guestController.updateAttendanceBySlug(req, res, next);
});

app.post('/api/wedding/guests/:slug/attendance', (req, res, next) => {
  console.log('Direct POST handler for attendance endpoint');
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Pass to the controller
  guestController.updateAttendanceBySlug(req, res, next);
});

// Global CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Check if the origin is allowed or if we're in development mode
  if (isDevelopment || !origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for:', req.originalUrl);
    return res.status(200).end();
  }

  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/wedding', weddingRoutes);
app.use('/api/pensiun', pensiunRoutes);
app.use('/api/jenis-pensiun', jenisPensiunRoutes);

// Initialize jenis pensiun data
const jenisPensiunController = require('./controllers/jenis_pensiun.controller');

// Sync Primary Database (SDM)
sequelize.sync().then(() => {
  console.log("Primary database (SDM) synced");

  // Initialize default jenis pensiun data after database sync
  jenisPensiunController.initializeJenisPensiun();
}).catch((err) => {
  console.log("Error syncing primary database: ", err);
});

// Sync Wedding Invitation Database
weddingSequelize.sync().then(() => {
  console.log("Wedding invitation database synced");
}).catch((err) => {
  console.log("Error syncing wedding invitation database: ", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
