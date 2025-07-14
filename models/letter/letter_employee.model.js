const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.config');

const LetterEmployee = sequelize.define('LetterEmployee', {
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
}, {
  tableName: 'letter_employees',
  timestamps: false,
});

module.exports = LetterEmployee; 