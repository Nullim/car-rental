const { Sequelize } = require('sequelize');
const CarsRepository = require('../carsRepository');
const carModel = require('../../model/carModel');
const { carNoId, carWithId } = require('./cars.fixture');

describe ('CarsRepository Testing', () => {
  const sequelize = new Sequelize('sqlite::memory');
  const car = carModel.setup(sequelize);
  const repository = new CarsRepository(car);

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  test('adds new car to the database', async () => {
    const newCar = await repository.save(carNoId);

    expect(newCar.id).toEqual(1);
    expect(newCar.brand).toEqual('Chevrolet');
    expect(newCar.model).toEqual('Camaro SS');
  });

  test('adding cars to database updates id', async () => {
    const firstCar = await repository.save(carNoId);
    const secondCar = await repository.save(carNoId);

    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Chevrolet');
    expect(firstCar.model).toEqual('Camaro SS');

    expect(secondCar.id).toEqual(2);
    expect(secondCar.brand).toEqual('Chevrolet');
    expect(secondCar.model).toEqual('Camaro SS');
  })

  test('updates a car in the database', async () => {
    const firstCar = await repository.save(carNoId)
    expect(firstCar.id).toEqual(1);
    expect(firstCar.brand).toEqual('Chevrolet')

    const updatedCar = await repository.save(carWithId);
    expect(updatedCar.id).toEqual(1);
    expect(updatedCar.brand).toEqual('Ford');
  })

  test('getAll returns every car in the database', async () => {
    await repository.save(carNoId);
    await repository.save(carNoId);
    const cars = await repository.getAll();

    expect(cars).toHaveLength(2);
    expect(cars[0].id).toEqual(1);
    expect(cars[1].id).toEqual(2);
  })

  test('deletes an existing car in the database and returns true', async () => {
    await repository.save(carNoId);
    await repository.save(carNoId);

    const deletedCar = await repository.delete({ id: 1 });
    const remainingCars = await repository.getAll();
    
    expect(deletedCar).toEqual(true);
    expect(remainingCars[0].id).toEqual(2);
   })

  test('deleting a non-existing car returns false', async () => {
    const deletedCar = await repository.delete ({ id: 1 });

    expect(deletedCar).toEqual(false);
  })
})