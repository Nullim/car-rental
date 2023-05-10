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
    return this.carsRepository.save(car);
  }
  
  /**
   * @param {import('../entity/car')} car
   */
  async delete(car) {
    return this.carsRepository.delete(car);
  }

  /**
  * @param {number} carId
  */
  async getById(carId) {
    return this.carsRepository.getById(carId);
  }

  async getAll() {
    return this.carsRepository.getAll();
  }
};
