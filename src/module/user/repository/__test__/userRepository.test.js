const { Sequelize } = require('sequelize');
const UserRepository = require('../userRepository');
const userModel = require('../../model/userModel');
const testUserCreator = require('../../controller/__test__/user.fixture');
const userIdUndefined = require('../../error/userIdUndefined');
const userUndefined = require('../../error/userUndefined');
const userNotFound = require('../../error/userNotFound');

describe ('UserRepository Testing', () => {
  const sequelize = new Sequelize('sqlite::memory');
  const user = userModel.initialize(sequelize);
  const repository = new UserRepository(user);
  const newUser = testUserCreator();

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  test('adds new user to the database', async () => {
    const { id, firstName, lastName } = await repository.save(newUser)

    expect(id).toEqual(1);
    expect(firstName).toEqual('Pedro');
    expect(lastName).toEqual('Hernández');
  });

  test('throws an error on incomplete user arguments', async () => {
    const incompleteUser = { id: 2, firstName: 'Felipe', lastName: 'Pimpurro', idType: 'DNI' }
    await expect(repository.save(incompleteUser)).rejects.toThrowError(userUndefined);
  });

  test('adding users to database updates id', async () => {
    const firstUser = await repository.save(newUser);
    const secondUser = await repository.save(newUser);

    expect(firstUser.id).toEqual(1);
    expect(firstUser.firstName).toEqual('Pedro');
    expect(firstUser.lastName).toEqual('Hernández');

    expect(secondUser.id).toEqual(2);
    expect(secondUser.firstName).toEqual('Pedro');
    expect(secondUser.lastName).toEqual('Hernández');
  })

  test('updates an user in the database', async () => {
    const updatedUser = testUserCreator(1)
    updatedUser.firstName = 'Martin';
    updatedUser.lastName = 'Fierro';

    const firstUser = await repository.save(newUser);
    expect(firstUser.id).toEqual(1);
    expect(firstUser.firstName).toEqual('Pedro')
    expect(firstUser.lastName).toEqual('Hernández')
    
    await repository.save(updatedUser);
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.firstName).toEqual('Martin');
    expect(updatedUser.lastName).toEqual('Fierro');
  })

  test('getAll returns every user in the database', async () => {
    await repository.save(newUser);
    await repository.save(newUser);
    const users = await repository.getAll();

    expect(users).toHaveLength(2);
    expect(users[0].id).toEqual(1);
    expect(users[1].id).toEqual(2);
  })

  test('getById returns specified user', async () => {
    await repository.save(newUser);
    await repository.save(newUser);
    await repository.save(newUser);

    const requestedUser = await repository.getById(2);
    expect(requestedUser.id).toEqual(2);
  })

  test('getById throws an error on undefined id', async () => {
    await expect(repository.getById()).rejects.toThrowError(userIdUndefined);
  });

  test('getById throws an error on non-existent id', async () => {
    const userId = 2;
    await expect(repository.getById(userId)).rejects.toThrowError(userNotFound);
  });

  test('deletes an existing user in the database and returns true', async () => {
    await repository.save(newUser);
    await repository.save(newUser);

    const deletedUser = await repository.delete({ id: 1 });
    const remainingUsers = await repository.getAll();
    
    expect(deletedUser).toEqual(true);
    expect(remainingUsers[0].id).toEqual(2);
   })

  test('deleting a non-existing user returns false', async () => {
    const deletedUser = await repository.delete ({ id: 1 });
    expect(deletedUser).toEqual(false);
  })
})