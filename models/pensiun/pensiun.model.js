const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.config');
const Pegawai = require('../pegawai/pegawai.model');
const JenisPensiun = require('../jenis-pensiun/jenis_pensiun.model');

const Pensiun = sequelize.define('Pensiun', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nip: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Pegawai,
      key: 'nip',
    },
    onDelete: 'CASCADE',
  },
  jenis_pensiun_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: JenisPensiun,
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
  status: {
    type: DataTypes.ENUM('diajukan', 'diproses', 'selesai'),
    allowNull: false,
    defaultValue: 'diajukan',
  },
  berkas: {
    type: DataTypes.STRING,
    allowNull: true,
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
  tableName: 'pensiun',
  timestamps: false, // We'll manage timestamps manually
});

// Define associations
Pensiun.belongsTo(Pegawai, { foreignKey: 'nip' });
Pegawai.hasMany(Pensiun, { foreignKey: 'nip' });

Pensiun.belongsTo(JenisPensiun, { foreignKey: 'jenis_pensiun_id' });
JenisPensiun.hasMany(Pensiun, { foreignKey: 'jenis_pensiun_id' });

module.exports = Pensiun;
