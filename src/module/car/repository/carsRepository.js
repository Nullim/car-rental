const Car = require('../entity/car');
const { fromModelToEntity } = require('../mapper/carMapper');
const { fromModelToEntity: fromReservationModelToEntity } = require('../../reservations/mapper/reservationMapper');
const carIdUndefined = require('../error/carIdUndefined');
const carNotFound = require('../error/carNotFound');
const carUndefined = require('../error/carUndefined');
const ReservationModel = require('../../reservations/model/reservationsModel');

module.exports = class CarRepository {
  /**
   * @param {typeof import('../model/carModel')} carModel
   */
  constructor(carModel) {
    this.carModel = carModel;
  }

  /**
   * 
   * @param {import('../entity/car')} car 
   */

  async save(car) {
    if(!(car instanceof Car)) {
      throw new carUndefined();
    }
    const carInstance = this.carModel.build(car, {
      isNewRecord: !car.id
    });
    await carInstance.save();
    return fromModelToEntity(carInstance);
  }

  async delete(car) {
    return Boolean(
      await this.carModel.destroy({
        where: {
          id: car.id
        }
      })
    )
  }

  async getCarsLength() {
    return this.carModel.count();
  }

  async getLastCar() {
    const carInstance = await this.carModel.findOne({
      order: [['id', 'DESC']],
    });
    return fromModelToEntity(carInstance);
  }
  
  /**
  * @param {number} carId
  */
  async getById(carId) {
    if(!Number(carId)) {
      throw new carIdUndefined();
    }
    const carInstance = await this.carModel.findByPk(carId, { include: ReservationModel });
    if(!carInstance) {
      throw new carNotFound(`The car with ID ${carId} does not exist`);
    }
    const car = fromModelToEntity(carInstance);
    const reservations = carInstance.Reservations.map((instance) => 
      fromReservationModelToEntity(instance)
    )

    return { car, reservations }
  }

  async getAll() {
    const carInstances = await this.carModel.findAll();
    const cars = carInstances.map((carInstance) => fromModelToEntity(carInstance));
    return cars;
  }
}