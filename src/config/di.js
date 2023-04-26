const { default: DIContainer, factory, use, object } = require ('rsdi');
const path = require('path');
const Sqlite3Database = require('better-sqlite3');
const multer = require('multer');

const { CarController, CarService, CarRepository } = require('../module/car/module');
const { UserController, UserService, UserRepository } = require('../module/user/module');
const { ReservationController, ReservationService, ReservationRepository } = require('../module/reservations/module');

const container = new DIContainer()

function configureMainDatabaseAdapter() {
  return new Sqlite3Database(process.env.DB_PATH, { verbose: console.log });
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

/**
 * @param {DIContainer} container
 */
function addUserDefinitions() {
  container.add({
    UserController: object(UserController).construct(use('UserService')),
    UserService: object(UserService).construct(use('UserRepository')),
    UserRepository: object(UserRepository).construct(use('MainDatabaseAdapter'))
  });
}

/**
 * @param {DIContainer} container
 */
function addReservationDefinitions() {
  container.add({
    ReservationController: object(ReservationController).construct(use('CarService'), use('ReservationService'), use('UserService')),
    ReservationService: object(ReservationService).construct(use('ReservationRepository')),
    ReservationRepository: object(ReservationRepository).construct(use('MainDatabaseAdapter'))
  });
}

module.exports = function configureDI() {
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  addUserDefinitions(container);
  addReservationDefinitions(container);
  return container;
}