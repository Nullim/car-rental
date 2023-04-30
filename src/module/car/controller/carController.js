const { fromFormToEntity } = require('../mapper/carMapper');

module.exports = class CarController {
  /**
  * @param {import('../service/carsService')} carsService
  */
  constructor(carService, uploadMiddleware) {
    this.carService = carService;
    this.uploadMiddleware = uploadMiddleware
    this.ROUTE_BASE = '/car';
    this.CAR_VIEWS = '/car/views'
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}`, this.index.bind(this));
    app.get(`${ROUTE}/view/:carId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:carID`, this.edit.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('car-image'), this.save.bind(this));
    app.post(`${ROUTE}/delete/:carID`, this.delete.bind(this));
  }

  index(req, res) {
    res.render('index.njk')
    const cars = this.carService.getAll();
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
    const car = this.carService.getById(carId);
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
    this.carService.save(car);
    res.redirect('/');
  }

  delete(req, res) {
    const { carId } = req.params;
    const car = this.carService.getById(carId);
    this.carService.delete(car);
    res.redirect('/');
  }
}
