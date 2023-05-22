const { init: initUserModule } = require('../module')

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn()
}

const container = {
  get: jest.fn(() => controller)
}

test('User module is initialized succesfully', () => {
  initUserModule(app, container);

  expect(container.get).toHaveBeenCalledWith('UserController');
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
})