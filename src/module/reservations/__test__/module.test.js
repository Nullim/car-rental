const { init: initReservationModule } = require('../module')

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn()
}

const container = {
  get: jest.fn(() => controller)
}

test('Reservation module is initialized succesfully', () => {
  initReservationModule(app, container);

  expect(container.get).toHaveBeenCalledWith('ReservationController');
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
})