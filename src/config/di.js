const { default: DIContainer, factory, use, object } = require ('rsdi');
const fs = require('fs');
const path = require('path');
const Sqlite3Database = require('better-sqlite3');
const multer = require('multer');

const { CarController, CarsService, CarsRepository } = require('../module/car/module');

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
function addCarModuleDefinitions(container) {
  container.add({
    CarController: object(CarController).construct(use('Multer'), use('CarsService')),
    CarsService: object(CarsService).construct(use('CarsRepository')),
    CarsRepository: object(CarsRepository).construct(use('MainDatabaseAdapter'))
  });
}

module.exports = function configureDI() {
  const container = new DIContainer()
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  return container;
}