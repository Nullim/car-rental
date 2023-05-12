const CarController = require('./controller/carController');
const CarsService = require('./service/carsService');
const CarsRepository = require('./repository/carsRepository');
const CarModel = require('./model/carModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */

function init (app, container) {
  /**
   * @type {CarController} controller;
   */
  const controller = container.get('CarController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  CarController,
  CarsService,
  CarsRepository,
  CarModel
}
