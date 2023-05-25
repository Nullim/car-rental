const CarController = require('../carController');
const testCarCreator = require('../../repository/__test__/cars.fixture');

const mockService = {
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

const resMock = {
  render: jest.fn(),
  redirect: jest.fn()
};

const mockController = new CarController(uploadMock, mockService)

describe('CarController Testing', () => {
  afterEach(() => {
    Object.values(mockService).forEach((mockFn) => mockFn.mockClear());
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
    const cars = mockService.getAll()
    const carsLength = mockService.getCarsLength();
    const lastAddedCar = mockService.getLastCar();
    await mockController.index(reqMock, resMock);

    expect(mockService.getCarsLength).toHaveBeenCalledTimes(2);
    expect(mockService.getLastCar).toHaveBeenCalledTimes(2);
    expect(mockService.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/index.njk', {
      cars,
      carsLength,
      lastAddedCar
    });
  });

  test('index.njk renders if there are no cars in database', async() => {
    const cars = mockService.getAll()
    const carsLength = mockService.getCarsLength();
    mockService.getLastCar.mockRejectedValue()
    await mockController.index(reqMock, resMock);

    expect(mockService.getCarsLength).toHaveBeenCalledTimes(2);
    expect(mockService.getAll).toHaveBeenCalledTimes(2);
    expect(mockService.getLastCar).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/index.njk', {
      cars,
      carsLength,
      lastAddedCar: null
    });
  })

  test('view.njk is rendered', async () => {
    const { car, reservations } = mockService.getById(1);
    await mockController.view(reqMock, resMock);

    expect(mockService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/view.njk', {
      car,
      reservations
    });
  });

  test('view.njk renders error.njk when an error is thrown', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error('Test')))
    await mockController.view(reqMock, resMock)
    expect(resMock.render).toHaveBeenCalledWith('car/views/error.njk', { error: 'Test' })
  })

  test('edit.njk is rendered with a form to edit a car', async () => {
    const { car } = mockService.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(mockService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('car/views/edit.njk', {
      car
    });
  });

  test('edit.njk renders error.njk when an error is thrown', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error('Test')))
    await mockController.edit(reqMock, resMock)
    expect(resMock.render).toHaveBeenCalledWith('car/views/error.njk', { error: 'Test' })
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
    expect(mockService.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('saves car without image', async () => {
    const reqSaveMock = {
      body: {}
    };

    await mockController.save(reqSaveMock, resMock);
    expect(mockService.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('saving renders error.njk when an error is thrown', async () => {
    const reqSaveMock = {
      body: {},
      file: { path: '' }
    };

    mockService.save.mockRejectedValue(new Error('Test'))
    await mockController.save(reqSaveMock, resMock)
    expect(resMock.render).toHaveBeenCalledWith('car/views/error.njk', { error: 'Test' })
  })

  test('deletes a car', async () => {
    await mockController.delete(reqMock, resMock);

    expect(mockService.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('deleting renders error.njk when an error is thrown', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error('Test')))
    await mockController.delete(reqMock, resMock)
    expect(resMock.render).toHaveBeenCalledWith('car/views/error.njk', { error: 'Test' })
  })
})
