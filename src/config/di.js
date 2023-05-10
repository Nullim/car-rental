const { default: DIContainer, factory, use, object } = require ('rsdi');
const path = require('path');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const { CarController, CarsService, CarsRepository, CarModel } = require('../module/car/module');

function configureSequelizeDatabase() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH
  });
  return sequelize;
}

/**
 * @param {DIContainer} container 
 */

function configureCarModule(container) {
  return CarModel.setup(container.use('sequelize'))
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, process.env.MULTER_UPLOAD_PATH);
    },
    filename(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
      cb(null, uniqueSuffix);
    }
  });

  return multer({ storage });
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.add({
    Sequelize: factory(configureSequelizeDatabase),
    Multer: factory(configureMulter),
  });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions(container) {
  container.add({
    CarController: object(CarController).construct(use('Multer'), use('CarsService')),
    CarsService: object(CarsService).construct(use('CarsRepository')),
    CarsRepository: object(CarsRepository).construct(use('CarModel')),
    CarModel: factory(configureCarModule)
  });
}

module.exports = function configureDI() {
  const container = new DIContainer()
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  return container;
}