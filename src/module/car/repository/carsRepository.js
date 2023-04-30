const { fromDbToEntity } = require('../mapper/carMapper');

module.exports = class CarRepository {
  /**
   * @param {import('better-sqlite3').Sqlite3Database} databaseAdapter
   */
  constructor(databaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  /**
   * 
   * @param {import('../entity/car')} car 
   */

  save(car) {
    const { id, brand, model, year, kms, color, ac, passengers, transmission, price, img } = car;
    if (id) {
      const stmt = this.databaseAdapter.prepare(
        `UPDATE cars
        SET
          brand = ?,
          model = ?,
          year = ?,
          kms = ?,
          color = ?,
          ac = ?,
          passengers = ?,
          transmission = ?,
          price = ?,
          img = ?,
          updated_at = datetime('now', 'localtime')
      WHERE id = ?`
      );
      stmt.run(brand, model, year, kms, color, ac, passengers, transmission, price, img, id);
      return this.getById(id);
    }

    const stmt = this.databaseAdapter.prepare(
      `INSERT INTO cars(
            brand,
            model,
            year,
            kms,
            color,
            ac,
            passengers,
            transmission,
            price,
            img
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const mostRecentCar = stmt.run(brand, model, year, kms, color, ac, passengers, transmission, price, img);
    const { lastInsertRowid } = mostRecentCar;
    return this.getById(lastInsertRowid);
  }

  delete(car) {
    const { id } = car;
    const stmt = this.databaseAdapter.prepare('DELETE FROM cars WHERE id = ?');
    stmt.run(id);
    return car;
  }
  
  /**
  * @param {number} carId
  */
  getById(carId) {
    const stmt = this.databaseAdapter.prepare(
      `SELECT
        id,
        brand,
        model,
        year,
        kms,
        color,
        ac,
        passengers,
        transmission,
        price,
        img,
        created_at,
        updated_at
        FROM cars
        WHERE id = ?`
    );
    const carData = stmt.get(carId);
    return fromDbToEntity(carData);
  }

  getAll() {
    const stmt = this.databaseAdapter.prepare(
      `SELECT
        id,
        brand,
        model,
        year,
        kms,
        color,
        ac,
        passengers,
        transmission,
        price,
        img,
        created_at,
        updated_at
        FROM cars`
    );
    const cars = stmt.all().map((car) => fromDbToEntity(car));
    return cars;
  }
}