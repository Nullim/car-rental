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
  save(car) {
    return this.carsRepository.save(car);
  }
  
  /**
   * @param {import('../entity/car')} car
   */
  delete(car) {
    return this.carsRepository.delete(car);
  }

  /**
  * @param {number} carId
  */
  getById(carId) {
    return this.carsRepository.getById(carId);
  }

  getAll() {
    return this.carsRepository.getAll();
  }
};
