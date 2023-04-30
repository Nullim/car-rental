const { fromFormToEntity } = require('../mapper/carMapper');

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

  index(req, res) {
    const cars = this.carsService.getAll();
    const [lastAddedCar] = cars.reverse()
    res.render(`${this.CAR_VIEWS}/index.njk`, {
      cars,
      lastAddedCar
    })
  }

  view(req, res) {
    const { carId } = req.params;
    const car = this.carsService.getById(carId);
    res.render(`${this.CAR_VIEWS}/view.njk`, {
      car
    });
  }

  edit(req, res) {
    const { carId } = req.params;
    const car = this.carsService.getById(carId);
    res.render(`${this.CAR_VIEWS}/edit.njk`, {
      car
    });
  }

  add(req, res) {
    res.render(`${this.CAR_VIEWS}/add.njk`);
  }

  save(req, res) {
    const car = fromFormToEntity(req.body);
    if (req.file) {
      const path = req.file.path.split('public')[1];
      car.img = path
    }
    this.carsService.save(car);
    res.redirect('/');
  }

  delete(req, res) {
    const { carId } = req.params;
    const car = this.carsService.getById(carId);
    this.carsService.delete(car);
    res.redirect('/');
  }
}
