'use strict';

const CarModel = require('../../src/module/car/model/carModel');
const UserModel = require('../../src/module/user/model/userModel');
const ReservationsModel = require('../../src/module/reservations/model/reservationsModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    CarModel.initialize(queryInterface.sequelize).sync({ force: true });
    UserModel.initialize(queryInterface.sequelize).sync({ force: true });
    ReservationsModel.initialize(queryInterface.sequelize)
      .setupAssociations(CarModel, UserModel)
      .sync({ force: true });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Cars');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Reservations')
  }
};
