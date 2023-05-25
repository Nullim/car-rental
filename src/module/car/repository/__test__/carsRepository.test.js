const { Sequelize } = require('sequelize');
const CarsRepository = require('../carsRepository');
const CarModel = require('../../model/carModel');
const ReservationsModel = require('../../../reservations/model/reservationsModel')
const testCarCreator = require('./cars.fixture');
const testReservationCreator = require('../../../reservations/controller/__test__/reservations.fixture');
const carIdUndefined = require('../../error/carIdUndefined');
const carNotFound = require('../../error/carNotFound');
const carUndefined = require('../../error/carUndefined');

describe ('CarsRepository Testing', () => {
  const sequelize = new Sequelize('sqlite::memory', { logging: false });
  const car = CarModel.initialize(sequelize);
  const reservations = ReservationsModel.initialize(sequelize);
  car.hasMany(reservations, { foreignKey: 'carId' })
  reservations.belongsTo(car, { foreignKey: 'carId' })
  const repository = new CarsRepository(car);
  const newCar = testCarCreator()

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  test('adds new car to the database', async () => {
    const { id, brand, model } = await repository.save(newCar);

    expect(id).toEqual(1);
    expect(brand).toEqual('Ford');
    expect(model).toEqual('Mustang GT 5.0');
  });

  test('throws an error on incomplete car arguments', async () => {
    const incompleteCar = { id: 2, brand: 'Ford', model: 'Mustang GT 5.0', year: '2018' }
    await expect(repository.save(incompleteCar)).rejects.toThrowError(carUndefined);
  });

  test('adding cars to database updates id', async () => {
    const firstCar = await repository.save(newCar);
    const secondCar = await repository.save(newCar);

    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Ford');
    expect(firstCar.model).toEqual('Mustang GT 5.0');

    expect(secondCar.id).toEqual(2);
    expect(secondCar.brand).toEqual('Ford');
    expect(secondCar.model).toEqual('Mustang GT 5.0');
  })

  test('updates a car in the database', async () => {
    const updatedCar = testCarCreator(1)
    updatedCar.brand = 'Chevrolet';
    updatedCar.model = 'Camaro SS';

    const firstCar = await repository.save(newCar);
    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Ford')
    expect(firstCar.model).toEqual('Mustang GT 5.0')
    
    await repository.save(updatedCar);
    expect(updatedCar.id).toEqual(1);
    expect(updatedCar.brand).toEqual('Chevrolet');
    expect(updatedCar.model).toEqual('Camaro SS');
  })

  test('getAll returns every car in the database', async () => {
    await repository.save(newCar);
    await repository.save(newCar);
    const cars = await repository.getAll();

    expect(cars).toHaveLength(2);
    expect(cars[0].id).toEqual(1);
    expect(cars[1].id).toEqual(2);
  })

  test('getCarsLength returns number of cars in the database', async () => {
    await repository.save(newCar);
    await repository.save(newCar);
    await repository.save(newCar);
    const carsLength = await repository.getCarsLength();

    expect(carsLength).toEqual(3);
  })

  test('getLastCar returns the most recently added car', async () => {
    await repository.save(newCar);
    const carTwo = await repository.save(newCar);
    const lastAddedCar = await repository.getLastCar();

    expect(lastAddedCar).toEqual(carTwo);
  })

  test('getById returns specified car and its reservations', async () => {
    const reservation = testReservationCreator()

    await repository.save(newCar);
    await repository.save(newCar);
    await repository.save(newCar);

    const requestedCar = await repository.carModel.findByPk(2);
    await requestedCar.createReservation(reservation);
    await requestedCar.createReservation(reservation);

    const { car, reservations } = await repository.getById(2);
    expect(car.id).toEqual(2);
    expect(reservations).toHaveLength(2);
  })

  test('getById throws an error on undefined id', async () => {
    await expect(repository.getById()).rejects.toThrowError(carIdUndefined);
  });

  test('getById throws an error on non-existent id', async () => {
    const userId = 2;
    await expect(repository.getById(userId)).rejects.toThrowError(carNotFound);
  });

  test('deletes an existing car in the database and returns true', async () => {
    await repository.save(newCar);
    await repository.save(newCar);

    const { car: firstCar } = await repository.getById(1)
    const deletedCar = await repository.delete(firstCar);
    const remainingCars = await repository.getAll();
    
    expect(deletedCar).toEqual(true);
    expect(remainingCars[0].id).toEqual(2);
  })

  test('deleting a non-existing car returns false', async () => {
    const deletedCar = await repository.delete ({ id: 1 });

    expect(deletedCar).toEqual(false);
  })
})