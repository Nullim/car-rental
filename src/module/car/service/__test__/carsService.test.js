const CarsService = require('../carsService');

const repositoryMock = {
  save: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn()
};

const mockService = new CarsService(repositoryMock);

describe('CarsService Testing', () => {
  test('calls repository for saving', async () => {
    await mockService.save({});

    expect(repositoryMock.save).toHaveBeenCalledTimes(1)
    expect(repositoryMock.save).toHaveBeenCalledWith({});
  });

  test('calls repository to get a car by its id', async () => {
    await mockService.getById(1);
    
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
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
