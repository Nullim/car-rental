const Car = require('../entity/car');

exports.fromModelToEntity = ({
  id,
  brand,
  model,
  year,
  kms,
  color,
  ac,
  transmission,
  passengers,
  price,
  img,
  createdAt,
  updatedAt
}) =>
  new Car(
    Number(id),
    brand,
    model,
    Number(year),
    Number(kms),
    color,
    ac,
    transmission,
    Number(passengers),
    Number(price),
    img,
    createdAt,
    updatedAt
  );

exports.fromFormToEntity = ({
  id,
  brand,
  model,
  year,
  kms,
  color,
  ac,
  transmission,
  passengers,
  price,
  img,
  'created-at': createdAt,
}) =>
  new Car(id, brand, model, year, kms, color, ac, transmission, passengers, price, img, createdAt);