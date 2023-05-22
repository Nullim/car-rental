const Car = require('../../car/entity/car');
const carUndefined = require('../../car/error/carUndefined');
const Reservation =  require('../entity/reservation');
const reservationIdUndefined = require ('../error/reservationIdUndefined');
const reservationUndefined = require ('../error/reservationUndefined');

module.exports = class ReservationService {
  /**
   * @param {import('../repository/reservationRepository')} reservationRepository
   */

  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  /**
   * @param {import('../entity/reservation')} reservation
   * @param {import('../../car/entity/car')} car
   */

  async save(reservation, car) {
    if(!(reservation instanceof Reservation)) {
      throw new reservationUndefined();
    }
    if(!(car instanceof Car)) {
      throw new carUndefined();
    }
    reservation.calculateTotalPrice(car, reservation.rentalDailyPrice);
    reservation.determineReservationStatus();
    return this.reservationRepository.save(reservation);
  }

  async finish(reservation) {
    if(!(reservation instanceof Reservation)) {
      throw new reservationUndefined();
    }
    reservation.determineReservationStatus(true);
    return this.reservationRepository.save(reservation);
  }

  async unblock(reservation) {
    if(!(reservation instanceof Reservation)) {
      throw new reservationUndefined();
    }
    reservation.determineReservationStatus(false);
    return this.reservationRepository.save(reservation);
  }

  async pay(reservation) {
    if(!(reservation instanceof Reservation)) {
      throw new reservationUndefined();
    }
    reservation.payReservation();
    reservation.determineReservationStatus(false);
    return this.reservationRepository.save(reservation);
  }

  async getById(reservationId) {
    if(!Number(reservationId)) {
      throw new reservationIdUndefined();
    }
    return this.reservationRepository.getById(reservationId);
  }

  async getAll() {
    return this.reservationRepository.getAll();
  }
}
