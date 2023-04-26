module.exports = class CarService {
  /**
   * 
   * @param {import('../repository/carsRepository')} carRepository 
   */
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  /**
   * @param {import('../entity/car')} car
   */
  save(car) {
    this.carRepository.save(car);
  }

  /**
  * @param {number} carId
  */
  getById(carId) {
    return this.carRepository.getById(carId);
  }

  getAll() {
    return this.carRepository.getAll();
  }
};
