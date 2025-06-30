const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Letter = require('./letter.model');

const LetterSignature = sequelize.define('LetterSignature', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  letter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jabatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urutan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'letter_signatures',
  timestamps: false,
});

LetterSignature.belongsTo(Letter, { foreignKey: 'letter_id' });

module.exports = LetterSignature; 