const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.config');

const Pegawai = sequelize.define('Pegawai', {
  nip: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  golongan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tmt_pensiun: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  unit_kerja: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  induk_unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jabatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'pegawai',  // Pastikan nama tabel sesuai dengan database
  timestamps: false, // Nonaktifkan penggunaan createdAt dan updatedAt
});

module.exports = Pegawai;
