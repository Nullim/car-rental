const { default: DIContainer, factory, use, object } = require ('rsdi');
const fs = require('fs');
const path = require('path');
const Sqlite3Database = require('better-sqlite3');
const multer = require('multer');

const { CarController, CarService, CarRepository } = require('../module/car/module');

const container = new DIContainer()

function configureMainDatabaseAdapter() {
  const database = new Sqlite3Database(process.env.DB_PATH, { verbose: console.log });
  database.exec(fs.readFileSync('./src/config/setup.sql', 'utf-8'))
  return database;
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
    MainDatabaseAdapter: factory(configureMainDatabaseAdapter),
    Multer: factory(configureMulter),
  });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions() {
  container.add({
    CarController: object(CarController).construct(use('Multer'), use('CarService')),
    CarService: object(CarService).construct(use('CarRepository')),
    CarRepository: object(CarRepository).construct(use('MainDatabaseAdapter'))
  });
}

module.exports = function configureDI() {
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  return container;
}