require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./config/db.config');
const pegawaiRoutes = require('./routes/pegawai/pegawai.routes');
const authRoutes = require('./routes/auth/auth.routes');
const pensiunRoutes = require('./routes/pensiun/pensiun.routes');
const jenisPensiunRoutes = require('./routes/jenis-pensiun/jenis_pensiun.routes');
const letterRoutes = require('./routes/letter/letter.routes');

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
  : [process.env.PROD_PEGAWAI_DOMAIN].filter(Boolean);

console.log('Allowed origins:', allowedOrigins);



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
app.use('/api/pensiun', pensiunRoutes);
app.use('/api/jenis-pensiun', jenisPensiunRoutes);
app.use(letterRoutes);

// Initialize jenis pensiun data
const jenisPensiunController = require('./controllers/jenis-pensiun/jenis_pensiun.controller');

// Sync Database
sequelize.sync().then(() => {
  console.log("Database synced");

  // Initialize default jenis pensiun data after database sync
  jenisPensiunController.initializeJenisPensiun();
}).catch((err) => {
  console.log("Error syncing database: ", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
