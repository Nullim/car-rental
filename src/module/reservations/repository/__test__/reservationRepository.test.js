const { Sequelize } = require('sequelize');
const ReservationRepository = require('../reservationRepository');
const CarModel = require('../../../car/model/carModel');
const UserModel = require('../../../user/model/userModel');
const testReservationCreator = require('../../controller/__test__/reservations.fixture');
const testUserCreator = require('../../../user/controller/__test__/user.fixture');
const testCarCreator = require('../../../car/repository/__test__/cars.fixture');
const ReservationsModel = require('../../model/reservationsModel');
const reservationIdUndefined = require('../../error/reservationIdUndefined');
const reservationUndefined = require('../../error/reservationUndefined');
const reservationNotFound = require('../../error/reservationNotFound');

describe('ReservationRepository testing', () => {
  const sequelize = new Sequelize('sqlite::memory', { logging: false } );
  const reservation = ReservationsModel.initialize(sequelize);
  CarModel.initialize(sequelize);
  UserModel.initialize(sequelize);
  reservation.setupAssociations(CarModel, UserModel);
  const repository = new ReservationRepository(reservation);
  const newReservation = testReservationCreator()

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  test('saves reservation in database', async() => {
    const { id, startDate, endDate } = await repository.save(newReservation)

    expect(id).toEqual(1);
    expect(startDate).toEqual('2023-04-13T14:00');
    expect(endDate).toEqual('2023-04-16T14:00');
  })

  test('updates a reservation in database', async() => {
    const updatedReservation = testReservationCreator(1);
    updatedReservation.paymentStatus = false;

    const firstReservation = await repository.save(newReservation)
    expect(firstReservation.id).toEqual(1);
    expect(firstReservation.paymentStatus).toEqual(true);

    await repository.save(updatedReservation);
    expect(updatedReservation.id).toEqual(1);
    expect(updatedReservation.paymentStatus).toEqual(false);
  })

  test('save throws an error with incomplete parameters', async() => {
    const reservation = { id:1, paymentStatus: false, status: 'Pending'};
    
    await expect(repository.save(reservation)).rejects.toThrowError(reservationUndefined);
  })

  test('getAll returns every reservation in database', async() => {
    await repository.save(newReservation);
    await repository.save(newReservation);
    
    const reservations = await repository.getAll();

    expect(reservations).toHaveLength(2);
  })

  test('getById returns a reservation with its associated car and user from the database', async() => {
    const carWithId = testCarCreator(1);
    const userWithId = testUserCreator(1);
    await CarModel.create(carWithId);
    await UserModel.create(userWithId);
    await repository.save(newReservation);

    const { reservation, car, user } = await repository.getById(1);
    expect(reservation.id).toEqual(1);
    expect(car.id).toEqual(1);
    expect(user.id).toEqual(1);
  })

  test('getById returns a reservation with associated user and car as null', async() => {
    const userWithId = testUserCreator(1);
    await UserModel.create(userWithId);
    await repository.save(newReservation);

    const { reservation, car, user } = await repository.getById(1);
    expect(reservation.id).toEqual(1);
    expect(car).toBeNull();
    expect(user.id).toEqual(1);
  })

  test('getById throws an error on undefined reservation id', async () => {
    await expect(repository.getById()).rejects.toThrowError(reservationIdUndefined);
  });

  test('getById throws an error on non-existant reservation in database', async() => {
    const reservationId = 2;

    await expect(repository.getById(reservationId)).rejects.toThrowError(reservationNotFound);
    await expect(repository.getById(reservationId)).rejects.toThrowError(
      `There is no reservation with ID ${reservationId}`
    );
  })
})
