const Car = require('../entity/car');
const carIdUndefined = require('../error/carIdUndefined');
const carUndefined = require('../error/carUndefined');

module.exports = class CarService {
  /**
   * 
   * @param {import('../repository/carsRepository')} carsRepository 
   */
  constructor(carsRepository) {
    this.carsRepository = carsRepository;
  }

  /**
   * @param {import('../entity/car')} car
   */
  async save(car) {
    if(!(car instanceof Car)) {
      throw new carUndefined();
    }
    return this.carsRepository.save(car);
  }
  
  /**
   * @param {import('../entity/car')} car
   */
  async delete(car) {
    return this.carsRepository.delete(car);
  }

  async getCarsLength() {
    return this.carsRepository.getCarsLength();
  }

  async getLastCar() {
    return this.carsRepository.getLastCar();
  }

  /**
  * @param {number} carId
  */
  async getById(carId) {
    if(!Number(carId)) {
      throw new carIdUndefined()
    }
    return this.carsRepository.getById(carId);
  }

  async getAll() {
    return this.carsRepository.getAll();
  }
};
