const { Sequelize } = require('sequelize');

const weddingSequelize = new Sequelize(
  process.env.WEDDING_DB_NAME, 
  process.env.WEDDING_DB_USER, 
  process.env.WEDDING_DB_PASSWORD, 
  {
    host: process.env.WEDDING_DB_HOST,
    dialect: 'mysql',
  }
);

module.exports = { weddingSequelize };
