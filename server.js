require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Import cors
const { sequelize } = require('./config/db.config');
const pegawaiRoutes = require('./routes/pegawai.routes');

const app = express();

// CORS Configuration - Allow requests from port 8080
const corsOptions = {
  origin: 'http://localhost:5173',  // Sesuaikan dengan origin frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Use the CORS middleware
app.use(cors(corsOptions));  // Apply CORS middleware

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
