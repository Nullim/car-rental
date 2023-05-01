const Car = require('../../entity/car');

exports.carWithId = new Car (
  '1',
  'Ford',
  'Mustang GT 5.0',
  '2018',
  '50493',
  'Red',
  'Yes',
  'Automatic',
  '4',
  '5000',
  '/img/default.png',
  undefined,
  undefined
)

exports.carNoId = new Car(
  undefined,
  'Chevrolet',
  'Camaro SS',
  '2020',
  '34750',
  'Blue',
  'Yes',
  'Manual',
  '4',
  '8000',
  '/img/default.png',
  undefined,
  undefined
)