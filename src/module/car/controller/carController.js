const { fromFormToEntity } = require('../mapper/carMapper');

module.exports = class CarController {
  /**
  * @param {import('../service/carsService')} carsService
  */
  constructor(carService) {
    this.carService = carService;
    this.ROUTE_BASE = '/car';
    this.CAR_VIEWS = '/car/views'
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/manage`, this.manage.bind(this));
    app.get(`${ROUTE}/view/:carId`, this.view.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
  }

  index(req, res) {
    res.render('index.njk')
    const cars = this.carService.getAll();
    res.render(`${this.CAR_VIEWS}/index.njk`, {
      cars
    })
  }

  manage(req, res) {
    const cars = this.carService.getAll();
    res.render(`${this.CAR_VIEWS}/manage.njk`, {
      cars
    });
  }

  view(req, res) {
    const { carId } = req.params;
    const car = this.carsService.getById(carId);
    res.render(`${this.CAR_VIEWS}/view.njk`, {
      car
    });
  }

  add(req, res) {
    res.render(`${this.CAR_VIEWS}/add.njk`);
  }

  save(req, res) {
    const car = fromFormToEntity(req.body);
    this.carService.save(car);
    res.redirect('/');
  }
}