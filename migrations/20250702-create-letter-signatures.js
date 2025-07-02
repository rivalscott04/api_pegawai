"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("letter_signatures", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      letter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "letters",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      nip: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      jabatan: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      urutan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("letter_signatures");
  },
}; 