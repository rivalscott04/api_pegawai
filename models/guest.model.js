const { DataTypes } = require('sequelize');
const { weddingSequelize } = require('../config/wedding_db.config');

const Guest = weddingSequelize.define('Guest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  attended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'guests',
  timestamps: false, // We'll manage timestamps manually
  indexes: [
    {
      fields: ['slug'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = Guest;
