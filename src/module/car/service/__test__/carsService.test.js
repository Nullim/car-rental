const CarsService = require('../carsService');
const testCarCreator = require('../../repository/__test__/cars.fixture');
const carUndefined = require('../../error/carUndefined');
const carIdUndefined = require('../../error/carIdUndefined');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn()
};

const mockService = new CarsService(repositoryMock);

describe('CarsService Testing', () => {
  test('calls repository for saving a car', async () => {
    const carWithId = testCarCreator(1)
    await mockService.save(carWithId);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1)
    expect(repositoryMock.save).toHaveBeenCalledWith(carWithId);
  });

  test('throws an error on incomplete car arguments', async () => {
    const car = { id: 2, brand: 'Ford', model: 'Mustang GT 5.0', year: '2018' }
    await expect(mockService.save(car)).rejects.toThrowError(carUndefined);
  });

  test('calls repository to get a car by its id', async () => {
    await mockService.getById(1);
    
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('throw an error on invalid carId', async () => {
    await expect(mockService.getById()).rejects.toThrowError(carIdUndefined);
  });

  test('calls repository to get all cars from database', async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test('calls repository to delete car from database', async () => {
    await mockService.delete({});

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith({});
  });
});
