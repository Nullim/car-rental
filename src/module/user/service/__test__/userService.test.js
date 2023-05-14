const UserService = require('../userService');
const userIdUndefined = require('../../error/userIdUndefined');
const userUndefined = require('../../error/userUndefined');
const testUserCreator = require('../../controller/__test__/user.fixture');

const repositoryMock = {
  save: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  delete: jest.fn()
}

const mockService = new UserService(repositoryMock);

describe('UserService testing', () => {
  test('calls repository for saving an user', async () => {
    const user = testUserCreator(1);
    await mockService.save(user);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1)
    expect(repositoryMock.save).toHaveBeenCalledWith(user);
  });

  test('throws an error on incomplete user arguments', async () => {
    const user = { id: 2, firstName: 'Felipe', lastName: 'Pimpurro', idType: 'DNI' }
    await expect(mockService.save(user)).rejects.toThrowError(userUndefined);
  });

  test('calls repository to get a user by its id', async () => {
    await mockService.getById(1);
    
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
    expect(repositoryMock.getById).toHaveBeenCalledWith(1);
  });

  test('throw an error on invalid userId', async () => {
    await expect(mockService.getById()).rejects.toThrowError(userIdUndefined);
  });

  test('calls repository to get all user from database', async () => {
    await mockService.getAll();

    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
  });

  test('calls repository to delete user from database', async () => {
    await mockService.delete(1);

    expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(repositoryMock.delete).toHaveBeenCalledWith(1);
  });
})