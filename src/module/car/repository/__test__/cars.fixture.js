const Car = require('../../entity/car');

module.exports = function testCarCreator(id) {
  return new Car (
    id,
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
}
