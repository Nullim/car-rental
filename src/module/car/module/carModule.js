const CarController = require('./controller/carController');
const CarService = require('./service/carService');
const CarRepository = require('./repository/carsRepository');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */

function initCarModule(app, container) {
  /**
   * @type {CarController} controller;
   */
  const controller = container.get('CarController');
  controller.configureRoutes(app)
}

module.exports = {
  initCarModule,
  CarController,
  CarService,
  CarRepository
}