"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("doctor_info", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      doctorId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      specialtyId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinicId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      priceId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      provinceId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      addressClinic: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nameClinic: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      count: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("doctorInfo");
  },
};
