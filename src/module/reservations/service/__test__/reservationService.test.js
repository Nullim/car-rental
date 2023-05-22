const ReservationService = require('../reservationService');
const testReservationCreator = require('../../controller/__test__/reservations.fixture');
const testCarCreator = require('../../../car/repository/__test__/cars.fixture');
const reservationUndefined = require('../../error/reservationUndefined');
const reservationIdUndefined = require('../../error/reservationIdUndefined');
const carUndefined = require('../../../car/error/carUndefined');

const mockRepository = {
  save: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn()
}

const mockService = new ReservationService(mockRepository);

describe('ReservationService Testing', () => {
  afterEach(() => {
    Object.values(mockRepository).forEach((mockFn) => mockFn.mockClear());
  })
  const newReservation = testReservationCreator(1);
  const newCar = testCarCreator(1);

  test('save calls repository to save reservation with default prices from reservation', async() => {
    newReservation.totalPrice = undefined;
    newReservation.status = undefined;
    await mockService.save(newReservation, newCar);

    expect(newReservation.totalPrice).toEqual(8000);
    expect(newReservation.status).toEqual('Confirmed')
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })
  
  test('save calls repository to save reservation with default prices from car price', async() => {
    newReservation.totalPrice = undefined;
    newReservation.rentalDailyPrice = undefined;
    newReservation.status = undefined;
    newCar.price = 3000;
    await mockService.save(newReservation, newCar);

    expect(newReservation.rentalDailyPrice).toEqual(3000);
    expect(newReservation.totalPrice).toEqual(12000);
    expect(newReservation.status).toEqual('Confirmed');
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })

  test('save throws error on incomplete reservation', async() => {
    const reservation = { id: 1, firstName: 'Pepe', lastName: 'Rodrigo' };

    await expect(mockService.save(reservation)).rejects.toThrowError(reservationUndefined);
  })

  test('save throws an error on trying to make reservation with incomplete car', async() => {
    const car = { id: 1, brand:'Chevrolet', model:'Camaro'};

    await expect(mockService.save(newReservation, car)).rejects.toThrowError(carUndefined);
  })

  test('finish calls repository to save', async() => {
    newReservation.status = undefined;
    await mockService.finish(newReservation);

    expect(newReservation.status).toEqual('Finished');
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })

  test('finish throws error on incomplete reservation', async () => {
    const reservation = { id: 1, firstName: 'Pepe', lastName: 'Rodrigo' };

    await expect(mockService.finish(reservation)).rejects.toThrowError(reservationUndefined);
  })

  test('unblock calls repository to save and set reservation status to "Confirmed"', async() => {
    newReservation.status = undefined;
    newReservation.paymentStatus = true;
    await mockService.unblock(newReservation);

    expect(newReservation.status).toEqual('Confirmed');
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })

  test('unblock calls repository to save and set reservation status to "Pending"', async() => {
    newReservation.status = undefined;
    newReservation.paymentStatus = false;
    await mockService.unblock(newReservation);

    expect(newReservation.status).toEqual('Pending');
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })

  test('unblock throws error on incomplete reservation', async () => {
    const reservation = { id: 1, firstName: 'Pepe', lastName: 'Rodrigo' };

    await expect(mockService.unblock(reservation)).rejects.toThrowError(reservationUndefined);
  })

  test('pay calls repository to save and set reservation status to "Confirmed"', async() => {
    newReservation.status = undefined;
    newReservation.paymentStatus = false;
    await mockService.pay(newReservation);

    expect(newReservation.status).toEqual('Confirmed');
    expect(newReservation.paymentStatus).toEqual(true);
    expect(mockRepository.save).toHaveBeenCalledWith(newReservation);
  })

  test('pay throws error on incomplete reservation', async () => {
    const reservation = { id: 1, firstName: 'Pepe', lastName: 'Rodrigo' };

    await expect(mockService.pay(reservation)).rejects.toThrowError(reservationUndefined);
  })

  test('getAll calls repository to return every stored reservation in database', async() => {
    await mockService.getAll();

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
  })

  test('getById calls repository to return specified reservation by id', async() => {
    await mockService.getById(1);
    expect(mockRepository.getById).toHaveBeenCalledWith(1);
  })

  test('getById throws an error on undefined id', async() => {
    await expect(mockService.getById()).rejects.toThrowError(reservationIdUndefined);
  })
})