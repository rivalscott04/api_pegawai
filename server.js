require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db.config');
const pegawaiRoutes = require('./routes/pegawai.routes');

const app = express();

// Environment Configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Log current environment
console.log(`Server running in ${NODE_ENV} mode`);

// Determine the correct domain based on environment
const frontendDomain = isDevelopment
  ? process.env.DEV_DOMAIN
  : process.env.PROD_DOMAIN;

// CORS Configuration
const corsOptions = {
  origin: frontendDomain,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

// Use the CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/pegawai', pegawaiRoutes);

// Sync Database
sequelize.sync().then(() => {
  console.log("Database synced");
}).catch((err) => {
  console.log("Error syncing database: ", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
