const User = require('../../entity/user');

module.exports = function createTestUser(id) {
  return new User (
    id,
    'Pedro',
    'Hernández',
    'DNI',
    39045618,
    'Argentino',
    'Av. Casares 3450',
    '+54 1234 55 6789',
    'pedroh@asdf.com',
    '1997-12-25',
    '2023-05-13T21:53:34.154Z',
    '2023-05-13T21:53:34.154Z'
  )
}