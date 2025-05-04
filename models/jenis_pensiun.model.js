const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const JenisPensiun = sequelize.define('JenisPensiun', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'jenis_pensiun',
  timestamps: false, // No need for timestamps in this table
});

module.exports = JenisPensiun;
