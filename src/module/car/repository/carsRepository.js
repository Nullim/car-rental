const Car = require('../entity/car');
const { fromModelToEntity } = require('../mapper/carMapper');
const carIdUndefined = require('../error/carIdUndefined');
const carNotFound = require('../error/carNotFound');
const carUndefined = require('../error/carUndefined');

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
  
  /**
  * @param {number} carId
  */
  async getById(carId) {
    if(!Number(carId)) {
      throw new carIdUndefined();
    }
    const carInstance = await this.carModel.findByPk(carId);
    if(!carInstance) {
      throw new carNotFound();
    }
    return fromModelToEntity(carInstance);
  }

  async getAll() {
    const carInstances = await this.carModel.findAll();
    const cars = carInstances.map((carInstance) => fromModelToEntity(carInstance));
    return cars;
  }
}