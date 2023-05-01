const CarController = require('../carController');
const Car = require('../../entity/car');

const serviceMock = {
  save: jest.fn(),
  getById: jest.fn(() => new Car()),
  getAll: jest.fn(() => []),
  delete: jest.fn()
};

const uploadMock = {
  single: jest.fn()
};

const reqMock = {
  params: { carId: jest.fn()}
};

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

  test('configure controller routes', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn()
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
    expect(uploadMock.single).toHaveBeenCalled();
  });

  test('index.njk is rendered', () => {
    mockController.index(reqMock, resMock);

    expect(serviceMock.getAll).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/index.njk', {
      cars: [],
      lastAddedCar: undefined
    });
  });

  test('view.njk is rendered', () => {
    mockController.view(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/view.njk', {
      car: new Car()
    });
  });

  test('edit.njk is rendered with a form to edit a car', () => {
    mockController.edit(reqMock, resMock);

    expect(serviceMock.getById).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith('car/views/edit.njk', {
      car: new Car()
    });
  });

  test('add.njk is rendered with a form to add a car', () => {
    mockController.add(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledWith('car/views/add.njk');
  });

  test('saves car with image', () => {
    const reqSaveMock = {
      body: {},
      file: { path: '' }
    };

    mockController.save(reqSaveMock, resMock);
    expect(serviceMock.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('deletes a car', () => {
    mockController.delete(reqMock, resMock);

    expect(serviceMock.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })
})
