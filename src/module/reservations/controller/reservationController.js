const { fromFormToEntity } = require('../mapper/reservationMapper');
const reservationIdUndefined = require('../error/reservationIdUndefined');
const reservationUndefined = require('../error/reservationUndefined');

module.exports = class ReservationController {
  /**
   * @param {import('../service/reservationService')} reservationService
   * @param {import('../../car/service/carService')} carService
   * @param {import('../../user/service/userService')} userService
   */

  constructor(reservationService, carService, userService) {
    this.reservationService = reservationService;
    this.carService = carService;
    this.userService = userService;
    this.ROUTE_BASE = '/reservations';
    this.RESERVATION_VIEWS = 'reservations/views';
  }

  /**
   * @param {import('express').Application} app
   */

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}/manage`, this.manage.bind(this));
    app.get(`${ROUTE}/view/:reservationId`, this.view.bind(this));
    app.get(`${ROUTE}/edit/:reservationId`, this.edit.bind(this));
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.post(`${ROUTE}/finish/:id`, this.finish.bind(this));
    app.post(`${ROUTE}/unblock/:id`, this.unblock.bind(this));
  }

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  async manage(req, res) {
    const reservations = await this.reservationService.getAll();
    res.render(`${this.RESERVATION_VIEWS}/manage.njk`, {
      reservations
    })
  }

  async view(req, res) {
    try {
      const { reservationId } = req.params;
      if(!Number(reservationId)) {
        throw new reservationIdUndefined();
      }

      const { reservation, car, user } = await this.reservationService.getById(reservationId);
      res.render(`${this.RESERVATION_VIEWS}/view.njk`, {
        reservation,
        car,
        user
      })
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async add(req, res) {
    try {
      const cars = await this.carService.getAll();
      const users = await this.userService.getAll();

      if (!cars.length) {
        throw new reservationUndefined("There are no cars to create a reservation with")
      } else if (!users.length) {
        throw new reservationUndefined("There are no users to create a reservation with")
      }

      res.render(`${this.RESERVATION_VIEWS}/add.njk`, {
        cars,
        users
      });
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async save(req, res) {
    try {
      const reservation = fromFormToEntity(req.body);
      const { car } = await this.carService.getById(reservation.carId)
      await this.reservationService.save(reservation, car);
      res.redirect(`${this.ROUTE_BASE}/manage`);
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async edit(req, res) {
    try {
      const { reservationId } = req.params;
      if(!Number(reservationId)) {
        throw new reservationIdUndefined();
      }
      const cars = await this.carService.getAll();
      const users = await this.userService.getAll();

      const { reservation } = await this.reservationService.getById(reservationId);
      res.render(`${this.RESERVATION_VIEWS}/edit.njk`, {
        reservation,
        cars,
        users
      })
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async finish(req, res) {
    try {
      const { reservationId } = req.params;
      if(!Number(reservationId)) {
        throw new reservationIdUndefined("Reservation ID does not exist");
      }
      const { reservation } = await this.reservationService.getById(reservationId);
      await this.reservationService.finish(reservation);
      res.redirect(`${this.ROUTE_BASE}/manage`);
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
    
  }

  async unblock(req, res) {
    try {
      const { reservationId } = req.params;
      if(!Number(reservationId)) {
        throw new reservationIdUndefined("Reservation ID does not exist");
      }
      const { reservation } = await this.reservationService.getById(reservationId);
      await this.reservationService.unblock(reservation);
      res.redirect(`${this.ROUTE_BASE}/manage`);
    } catch (e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async pay(req, res) {
    try {
      const { reservationId } = req.params;
      if(!Number(reservationId)) {
        throw new reservationIdUndefined("Reservation ID does not exist");
      }
      const { reservation } = await this.reservationService.getById(reservationId);
      await this.reservationService.pay(reservation);
      res.redirect(`${this.ROUTE_BASE}/manage`);
    } catch(e) {
      res.render(`${this.RESERVATION_VIEWS}/error.njk`, { error: e.message})
    }
  }
}