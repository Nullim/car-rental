const { fromModelToEntity } = require('../mapper/reservationMapper');
const { fromModelToEntity: fromCarModelToEntity } = require('../../car/mapper/carMapper');
const { fromModelToEntity: fromUserModelToEntity } = require('../../user/mapper/userMapper');
const reservationUndefined = require('../error/reservationUndefined');
const reservationIdUndefined = require('../error/reservationIdUndefined');
const reservationNotFound = require('../error/reservationNotFound');
const Reservation = require('../entity/reservation');
const CarModel = require('../../car/model/carModel');
const UserModel = require('../../user/model/userModel');

module.exports = class ReservationRepository {
  /**
   * @param {typeof import('../model/reservationsModel')} reservationsModel
   */

  constructor(reservationsModel) {
    this.reservationsModel = reservationsModel;
  }

  /**
   * @param {import('../entity/reservation')} reservation
   */

  async save(reservation) {
    if(!(reservation instanceof Reservation)) {
      throw new reservationUndefined("Reservation has invalid parameters");
    } else if(reservation.startDate > reservation.endDate) {
      throw new reservationUndefined("Start Date cannot go after End Date")
    }

    const reservationInstance = this.reservationsModel.build(reservation, {
      isNewRecord: !reservation.id
    });

    await reservationInstance.save();
    return fromModelToEntity(reservationInstance);
  }

  async getById(reservationId) {
    if(!Number(reservationId)) {
      throw new reservationIdUndefined(`There is no reservation with ID ${reservationId}`);
    }
    const reservationInstance = await this.reservationsModel.findByPk(reservationId, {
      include: [CarModel, UserModel]
    });
    if(!reservationInstance) {
      throw new reservationNotFound(
        `There is no reservation with ID ${reservationId}`
      );
    }
    const reservation = fromModelToEntity(reservationInstance);
    let car;
    if (reservationInstance.Car) {
      car = fromCarModelToEntity(reservationInstance.Car);
    } else {
      car = reservationInstance.Car;
    }
    const user = fromUserModelToEntity(reservationInstance.User);
    return { reservation, car, user };
  }

  async getAll() {
    const reservationList = await this.reservationsModel.findAll();
    const reservations = reservationList.map((reservation) => fromModelToEntity(reservation));
    return reservations;
  }
}
