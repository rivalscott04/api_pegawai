const { DataTypes } = require('sequelize');
const { weddingSequelize } = require('../config/wedding_db.config');
const Guest = require('./guest.model');

const Message = weddingSequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guest_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Guest,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_attending: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'messages',
  timestamps: false, // We'll manage timestamps manually
});

// Define association
Message.belongsTo(Guest, { foreignKey: 'guest_id' });
Guest.hasMany(Message, { foreignKey: 'guest_id' });

module.exports = Message;
