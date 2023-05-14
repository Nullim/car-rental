const User = require('../entity/user');

exports.fromModelToEntity = ({
  id,
  firstName,
  lastName,
  idType,
  idNumber,
  nationality,
  address,
  phoneNumber,
  email,
  birthday,
  createdAt,
  updatedAt,
}) =>
  new User(
    Number(id),
    firstName,
    lastName,
    idType,
    Number(idNumber),
    nationality,
    address,
    phoneNumber,
    email,
    birthday,
    createdAt,
    updatedAt
  );

exports.fromFormToEntity = ({
  id,
  'first-name': firstName,
  'last-name': lastName,
  'id-type': idType,
  'id-number': idNumber,
  nationality,
  address,
  'phone-number': phoneNumber,
  email,
  birthday,
  'created-at': createdAt
}) =>
  new User(
    id,
    firstName,
    lastName,
    idType,
    idNumber,
    nationality,
    address,
    phoneNumber,
    email,
    birthday,
    createdAt
  );