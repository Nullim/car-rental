/* eslint-disable no-undef */
const { default: DIContainer, factory, use, object } = require ('rsdi');
const path = require('path');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const { CarController, CarsService, CarsRepository, CarModel } = require('../module/car/module');
const { UserController, UserService, UserRepository, UserModel } = require('../module/user/module');
const { ReservationController, ReservationService, ReservationRepository, ReservationsModel } = require('../module/reservations/module');

function configureMainSequelizeDatabase() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH
  });
}

/**
 * @param {DIContainer} container 
 */
function configureCarModule(container) {
  return CarModel.initialize(container.get('Sequelize'));
}

function configureUserModule(container) {
  return UserModel.initialize(container.get('Sequelize'));
}

function configureReservationModule(container) {
  const model = ReservationsModel.initialize(container.get('Sequelize'));
  model.setupAssociations(CarModel, UserModel);
  return model;
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

function addCommonDefinitions(container) {
  container.add({
    Sequelize: factory(configureMainSequelizeDatabase),
    Multer: factory(configureMulter)
  });
}


function addCarModuleDefinitions(container) {
  container.add({
    CarController: object(CarController).construct(use('Multer'), use('CarsService')),
    CarsService: object(CarsService).construct(use('CarsRepository')),
    CarsRepository: object(CarsRepository).construct(use('CarModel')),
    CarModel: factory(configureCarModule)
  });
}

function addUserModuleDefinitions(container) {
  container.add({
    UserController: object(UserController).construct(use('UserService')),
    UserService: object(UserService).construct(use('UserRepository')),
    UserRepository: object(UserRepository).construct(use('UserModel')),
    UserModel: factory(configureUserModule)
  })
}

function addReservationModuleDefinitions(container) {
  container.add({
    ReservationController: object(ReservationController).construct(
      use('ReservationService'),
      use('CarsService'),
      use('UserService')
    ),
    ReservationService: object(ReservationService).construct(use('ReservationRepository')),
    ReservationRepository: object(ReservationRepository).construct(use('ReservationsModel')),
    ReservationsModel: factory(configureReservationModule)
  })
}

module.exports = function configureDI() {
  const container = new DIContainer()
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  addUserModuleDefinitions(container);
  addReservationModuleDefinitions(container);
  return container;
}