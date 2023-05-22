const { init: initCarModule } = require('../module')

const app = jest.fn();

const controller = {
  configureRoutes: jest.fn()
}

const container = {
  get: jest.fn(() => controller)
}

test('Car module is initialized succesfully', () => {
  initCarModule(app, container);

  expect(container.get).toHaveBeenCalledWith('CarController');
  expect(controller.configureRoutes).toHaveBeenCalledWith(app);
})