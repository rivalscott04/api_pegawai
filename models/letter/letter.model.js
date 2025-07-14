const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.config');

const Letter = sequelize.define('Letter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  letter_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Jenis surat, misal: SURAT_TUGAS, SURAT_KEPUTUSAN, NOTA_DINAS, dll',
  },
  nomor_surat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal_surat: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  perihal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'letters',
  timestamps: false,
});

module.exports = Letter; 