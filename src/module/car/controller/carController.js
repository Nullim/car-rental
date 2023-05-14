const { fromFormToEntity } = require('../mapper/carMapper');
const carIdUndefined = require('../error/carIdUndefined');

module.exports = class CarController {
  /**
  * @param {import('../service/carsService')} carsService
  */
  constructor(uploadMiddleware, carsService) {
    this.carsService = carsService;
    this.uploadMiddleware = uploadMiddleware
    this.ROUTE_BASE = '/car';
    this.CAR_VIEWS = 'car/views'
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:carId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:carId`, this.edit.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('car-image'), this.save.bind(this));
    app.get(`${ROUTE}/delete/:carId`, this.delete.bind(this));
  }

  async index(req, res) {
    const cars = await this.carsService.getAll();
    const [lastAddedCar] = cars.reverse()
    res.render(`${this.CAR_VIEWS}/index.njk`, {
      cars,
      lastAddedCar
    })
  }

  async view(req, res) {
    const { carId } = req.params;
    if (!Number(carId)) {
      throw new carIdUndefined();
    }
    const car = await this.carsService.getById(carId);
    res.render(`${this.CAR_VIEWS}/view.njk`, {
      car
    });
  }

  async edit(req, res) {
    const { carId } = req.params;
    if (!Number(carId)) {
      throw new carIdUndefined();
    }
    const car = await this.carsService.getById(carId);
    res.render(`${this.CAR_VIEWS}/edit.njk`, {
      car
    });
  }

  add(req, res) {
    res.render(`${this.CAR_VIEWS}/add.njk`);
  }

  async save(req, res) {
    const car = fromFormToEntity(req.body);
    if (req.file) {
      const path = req.file.path.split('public')[1];
      car.img = path
    }
    await this.carsService.save(car);
    res.redirect('/');
  }

  async delete(req, res) {
    const { carId } = req.params;
    const car = await this.carsService.getById(carId);
    this.carsService.delete(car);
    res.redirect('/');
  }
}
