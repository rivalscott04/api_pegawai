require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db.config');
const { weddingSequelize } = require('./config/wedding_db.config');
const pegawaiRoutes = require('./routes/pegawai.routes');
const weddingRoutes = require('./routes/wedding.routes');

const app = express();

// Environment Configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Log current environment
console.log(`Server running in ${NODE_ENV} mode`);

// CORS handling based on environment
if (isDevelopment) {
  // In development mode, manually handle CORS with very permissive settings
  console.log('Using manual CORS handling for development - allowing all origins');

  // Add CORS headers to all responses
  app.use((req, res, next) => {
    // Allow requests from any origin in development
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  });
} else {
  // In production, use the cors middleware with specific origins
  const allowedOrigins = [
    process.env.PROD_PEGAWAI_DOMAIN,
    process.env.PROD_WEDDING_DOMAIN
  ].filter(Boolean);

  console.log('Using production CORS configuration with origins:', allowedOrigins);

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  };

  app.use(cors(corsOptions));
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/wedding', weddingRoutes);

// Sync Primary Database (SDM)
sequelize.sync().then(() => {
  console.log("Primary database (SDM) synced");
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
