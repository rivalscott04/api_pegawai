const { DataTypes } = require('sequelize');
const { weddingSequelize } = require('../config/wedding_db.config');

const Setting = weddingSequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bride_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  groom_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  wedding_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  akad_time: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  reception_time: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  venue_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  venue_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  venue_map_link: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'settings',
  timestamps: false, // We'll manage timestamps manually
});

module.exports = Setting;
