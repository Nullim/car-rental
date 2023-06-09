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

  async index(req, res) {
    const cars = await this.carsService.getAll();
    const carsLength = await this.carsService.getCarsLength();
    let lastAddedCar;
    try {
      lastAddedCar = await this.carsService.getLastCar();
    } catch(e) {
      lastAddedCar = null;
    } finally {
      res.render(`${this.CAR_VIEWS}/index.njk`, {
        cars,
        carsLength,
        lastAddedCar
      })
    }
  }

  async view(req, res) {
    try { 
      const { carId } = req.params;
      const { car, reservations } = await this.carsService.getById(carId);
      res.render(`${this.CAR_VIEWS}/view.njk`, {
        car,
        reservations
      });
    } catch (e) {
      res.render(`${this.CAR_VIEWS}/error.njk`, { error: e.message })
    }
  }

  async edit(req, res) {
    try{
      const { carId } = req.params;
      const { car } = await this.carsService.getById(carId);
      res.render(`${this.CAR_VIEWS}/edit.njk`, {
        car
      });
    } catch (e) {
      res.render(`${this.CAR_VIEWS}/error.njk`, { error: e.message })
    }
  }

  add(req, res) {
    res.render(`${this.CAR_VIEWS}/add.njk`);
  }

  async save(req, res) {
    try {
      const car = fromFormToEntity(req.body);
      if (req.file) {
        const path = req.file.path.split('public')[1];
        car.img = path
      }
      await this.carsService.save(car);
      res.redirect('/');
    } catch (e) {
      res.render(`${this.CAR_VIEWS}/error.njk`, { error: e.message })
    }
  }

  async delete(req, res) {
    try {
      const { carId } = req.params;
      const { car } = await this.carsService.getById(carId);
      this.carsService.delete(car);
      res.redirect('/');
    } catch (e) {
      res.render(`${this.CAR_VIEWS}/error.njk`, { error: e.message })
    }
  }
}
