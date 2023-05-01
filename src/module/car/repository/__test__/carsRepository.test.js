const fs = require('fs');
const Sqlite3Database = require('better-sqlite3');
const CarsRepository = require('../carsRepository');
const { carNoId, carWithId } = require('./cars.fixture');

describe ('CarsRepository Testing', () => {
  let database;
  let repository;

  beforeEach(() => {
    const stmt = fs.readFileSync('./src/config/setup.sql', 'utf-8');
    database = new Sqlite3Database(':memory:');
    repository = new CarsRepository(database);
    repository.databaseAdapter.exec(stmt);
  });

  test('adds new car to database and returns it by id', () => {
    const newCar = repository.save(carNoId);

    expect(newCar.id).toEqual(1);
    expect(newCar.brand).toEqual('Chevrolet');
    expect(newCar.model).toEqual('Camaro SS');
  });

  test('adding cars to database updates id', () => {
    const firstCar = repository.save(carNoId);
    const secondCar = repository.save(carNoId);

    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Chevrolet');
    expect(firstCar.model).toEqual('Camaro SS');

    expect(secondCar.id).toEqual(2);
    expect(secondCar.brand).toEqual('Chevrolet');
    expect(secondCar.model).toEqual('Camaro SS');
  })

  test('updates a car in the database and returns it by id', () => {
    const firstCar = repository.save(carNoId)
    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Chevrolet')

    const updatedCar = repository.save(carWithId);
    expect(updatedCar.id).toEqual(1);
    expect(updatedCar.brand).toEqual('Ford');
  })

  test('getAll returns every car in the database', () => {
    repository.save(carNoId);
    repository.save(carNoId);
    const cars = repository.getAll();

    expect(cars).toHaveLength(2);
    expect(cars[0].id).toEqual(1);
    expect(cars[1].id).toEqual(2);
  })

  test('deletes an existing car in the database and returns it by id', () => {
    repository.save(carNoId);
    repository.save(carNoId);

    const selectedCar = repository.getById(1);
    const deletedCar = repository.delete(selectedCar);
    const remainingCars = repository.getAll();

    expect(deletedCar.id).toEqual(1);
    expect(remainingCars[0].id).toEqual(2);
   })
})