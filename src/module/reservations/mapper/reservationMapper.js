const Reservation = require('../entity/reservation');

exports.fromModelToEntity = ({
  id,
  startDate,
  endDate,
  rentalDailyPrice,
  totalPrice,
  paymentMethod,
  paymentStatus,
  status,
  carId,
  userId,
  createdAt,
  updatedAt
}) => new Reservation(
  id,
  startDate,
  endDate,
  rentalDailyPrice,
  totalPrice,
  paymentMethod,
  paymentStatus,
  status,
  carId,
  userId,
  createdAt,
  updatedAt
);
exports.fromFormToEntity = ({
  id,
  'start-date': startDate,
  'end-date': endDate,
  'rental-daily-price': rentalDailyPrice,
  'total-price': totalPrice,
  'payment-method': paymentMethod,
  'payment-status': paymentStatus,
  status,
  'car-id': carId,
  'user-id': userId,
  'created-at': createdAt
}) => new Reservation(
  id,
  startDate,
  endDate,
  rentalDailyPrice,
  totalPrice,
  paymentMethod,
  Boolean(paymentStatus),
  status,
  Number(carId),
  Number(userId),
  createdAt
)