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
    const { id, brand, model, year, kms, color, ac, passengers, transmission, price } = car;
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
          price = ?
          updated_at = datetime('now', 'localtime')
        WHERE id = ?`
      );
      stmt.run(brand, model, year, kms, color, ac, passengers, transmission, price, id)
    } else {
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
          price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run(brand, model, year, kms, color, ac, passengers, transmission, price);
    }
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
        created_at,
        updated_at
        FROM cars
        WHERE id = ?`
    );
    const carData = stmt.get(carId);
    return fromDbToEntity(carData);
  }

  getAll() {
    const stmt = this.database.prepare(
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
        created_at,
        updated_at
        FROM cars`
    );
    const cars = stmt.all().map((car) => fromDbToEntity(car));
    return cars;
  }
}