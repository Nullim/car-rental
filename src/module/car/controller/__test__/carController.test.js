const CarController = require('../carController');
const testCarCreator = require('../../repository/__test__/cars.fixture');
const carIdUndefined = require('../../error/carIdUndefined');

const serviceMock = {
  save: jest.fn(),
  getById: jest.fn((id) => {
    return {
      car: testCarCreator(id),
      reservations: Array.from({ length: 2 }, (reservationId) => {
        return {
          id: reservationId,
          carId: '1'
        }
      })
    }
  }),
  getAll: jest.fn(() => Array.from({ length: 2 }, (id) => testCarCreator(id + 1))),
  getCarsLength: jest.fn(() => 2),
  getLastCar: jest.fn(() => testCarCreator(2)),
  delete: jest.fn()
};

const uploadMock = {
  single: jest.fn()
};

const reqMock = {
  params: { carId: 1}
};

const reqMockNoId = {
  params: {}
}

const resMock = {
  render: jest.fn(),
  redirect: jest.fn()
};

const mockController = new CarController(uploadMock, serviceMock)

describe('CarController Testing', () => {
  afterEach(() => {
    Object.values(serviceMock).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configure car controller routes', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn()
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(uploadMock.single).toHaveBeenCalled();
  });

  test('index.njk is rendered', async () => {
    const cars = serviceMock.getAll()
    const carsLength = serviceMock.getCarsLength();
    const lastAddedCar = serviceMock.getLastCar();
    await mockController.index(reqMock, resMock);

    expect(serviceMock.getCarsLength).toHaveBeenCalledTimes(2);
    expect(serviceMock.getLastCar).toHaveBeenCalledTimes(2);
    expect(serviceMock.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/index.njk', {
      cars,
      carsLength,
      lastAddedCar
    });
  });

  test('view.njk is rendered', async () => {
    const { car, reservations } = serviceMock.getById(1);
    await mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/view.njk', {
      car,
      reservations
    });
  });

  test('view.njk throws an error when the car id is not defined', async () => {
    await expect(() => mockController.view(reqMockNoId, resMock)).rejects.toThrowError(
      carIdUndefined
    );
  })

  test('edit.njk is rendered with a form to edit a car', async () => {
    const { car } = serviceMock.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/edit.njk', {
      car
    });
  });

  test('edit.njk throws an error when the car id is not defined', async () => {
    await expect(() => mockController.edit(reqMockNoId, resMock)).rejects.toThrowError(
      carIdUndefined
    );
  })

  test('add.njk is rendered with a form to add a car', () => {
    mockController.add(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledWith('car/views/add.njk');
  });

  test('saves car with image', async () => {
    const reqSaveMock = {
      body: {},
      file: { path: '' }
    };

    await mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('deletes a car', async () => {
    await mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })
})
