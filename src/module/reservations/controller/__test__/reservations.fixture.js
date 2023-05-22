const Reservation = require('../../entity/reservation');

module.exports = function testReservationCreator (id) {
  return new Reservation(
    id,
    '2023-04-13T14:00',
    '2023-04-16T14:00',
    2000,
    4000,
    'Cash',
    true,
    'Confirmed',
    1,
    1
  )
}