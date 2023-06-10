const ReservationController = require('../reservationController');
const testReservationCreator = require('./reservations.fixture');
const testCarCreator = require('../../../car/repository/__test__/cars.fixture');
const testUserCreator = require('../../../user/controller/__test__/user.fixture');

const mockReservationService = {
  save: jest.fn(),
  finish: jest.fn(),
  unblock: jest.fn(),
  pay: jest.fn(),
  getAll: jest.fn(() => Array.from({ length: 3 }, (id) => testReservationCreator(id + 1))),
  getById: jest.fn((id) => {
    return {
      reservation: testReservationCreator(id),
      user: testUserCreator(1),
      car: testCarCreator(1)
    }
  })
}

const mockCarService = {
  getAll: jest.fn(() => [testCarCreator(1)]),
  getById: jest.fn(() => {
    return {
      car: undefined
    }
  })
}

const mockUserService = {
  getAll: jest.fn(() => [testUserCreator(1)])
}

const reqMock = {
  params: { reservationId: 1 }
}

const resMock = {
  render: jest.fn(),
  redirect: jest.fn()
}

const mockController = new ReservationController(
  mockReservationService,
  mockCarService,
  mockUserService
)

describe('ReservationController testing', () => {
  afterEach(() => {
    Object.values(mockReservationService).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  })

  test('configures routes', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn()
    }
    mockController.configureRoutes(app)

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
  })

  test('manage.njk is rendered', async () => {
    const reservations = mockReservationService.getAll();
    await mockController.manage(reqMock, resMock);

    expect(mockReservationService.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/manage.njk', {
      reservations
    })
  })

  test('view.njk is rendered', async() => {
    const { reservation, car, user } = mockReservationService.getById(1);
    await mockController.view(reqMock, resMock);

    expect(mockReservationService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/view.njk', {
      reservation,
      car,
      user
    })
  })

  test('view.njk renders error.njk when an error is thrown', async() => {
    const reqMockNoId = {
      params: {reservationId: null}
    }
    await mockController.view(reqMockNoId, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: '' })
  })

  test('edit.njk is rendered', async() => {
    const { reservation } = mockReservationService.getById(1);
    const cars = mockCarService.getAll();
    const users = mockUserService.getAll();
    await mockController.edit(reqMock, resMock);

    expect(mockReservationService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/edit.njk', {
      reservation,
      cars,
      users
    })
  })

  test('edit.njk renders error.njk when an error is thrown', async() => {
    const reqMockNoId = {
      params: {reservationId: null}
    }
    await mockController.edit(reqMockNoId, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: '' })
  })

  test('add.njk is rendered', async() => {
    const cars = mockCarService.getAll();
    const users = mockUserService.getAll();
    await mockController.add(reqMock, resMock)

    expect(resMock.render).toHaveBeenCalledWith('reservations/views/add.njk', {
      cars,
      users
    })
  })

  test('saves a reservation', async() => {
    const reqSaveMock = {
      body: {
        id: 1,
        'start-date': '2023-04-13T14:00',
        'end-date': '2023-04-16T14:00',
        'rental-daily-price': 2000,
        'total-price': 4000,
        'payment-method': 'Cash',
        'payment-status': true,
        status: 'Confirmed',
        'car-id': 1,
        'user-id': 1
      }
    }
    await mockController.save(reqSaveMock, resMock);
    expect(mockReservationService.save).toHaveBeenCalledWith(testReservationCreator(1), undefined);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('saving renders error.njk when an error is thrown', async () => {
    const reqSaveMock = {
      body: {}
    }
    mockReservationService.save.mockRejectedValue(new Error('Test'))
    await mockController.save(reqSaveMock, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: 'Test' })
  })

  test('mark reservation as finished', async() => {
    const reservation = testReservationCreator(1);
    await mockController.finish(reqMock, resMock);

    expect(mockReservationService.finish).toHaveBeenCalledWith(reservation);
  })

  test('finish throws an error with undefined reservation id', async () => {
    const reqMockEmpty = {
      params: {},
    }

    mockReservationService.finish.mockRejectedValue()
    await mockController.finish(reqMockEmpty, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: 'Reservation ID does not exist' })
  })

  test('mark reservation as unblocked', async() => {
    const reservation = testReservationCreator(1);
    await mockController.unblock(reqMock, resMock);

    expect(mockReservationService.unblock).toHaveBeenCalledWith(reservation);
  })

  test('unblock throws an error with undefined reservation id', async () => {
    const reqMockEmpty = {
      params: {},
    }

    mockReservationService.unblock.mockRejectedValue()
    await mockController.unblock(reqMockEmpty, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: 'Reservation ID does not exist' })
  })

  test('mark reservation as paid', async() => {
    const reservation = testReservationCreator(1);
    await mockController.pay(reqMock, resMock);

    expect(mockReservationService.pay).toHaveBeenCalledWith(reservation);
  })

  test('pay throws an error with undefined reservation id', async () => {
    const reqMockEmpty = {
      params: {},
    }

    mockReservationService.pay.mockRejectedValue()
    await mockController.pay(reqMockEmpty, resMock)
    expect(resMock.render).toHaveBeenCalledWith('reservations/views/error.njk', { error: 'Reservation ID does not exist' })
  })
})
