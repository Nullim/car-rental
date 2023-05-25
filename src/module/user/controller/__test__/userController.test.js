const UserController = require('../userController');
const testUserCreator = require('./user.fixture');

const mockService = {
  save: jest.fn(),
  getById: jest.fn((id) => {
    return {
      user: testUserCreator(id),
      reservations: Array.from({ length: 2 }, (reservationId) => {
        return {
          id: reservationId + 1,
          carId: '1'
        }
      })
    }
  }),
  getAll: jest.fn(() => Array.from({ length: 2 }, (id) => testUserCreator(id + 1))),
  delete: jest.fn()
};

const reqMock = {
  params: { userId: 1}
};

const resMock = {
  render: jest.fn(),
  redirect: jest.fn()
}

const mockController = new UserController(mockService);

describe('UserController testing', () => {
  afterEach(() => {
    Object.values(mockService).forEach((mockFn) => mockFn.mockClear());
    Object.values(resMock).forEach((mockFn) => mockFn.mockClear());
  });

  test('configure user controller routes', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn()
    };
    mockController.configureRoutes(app);

    expect(app.get).toHaveBeenCalled();
    expect(app.post).toHaveBeenCalled();
  })
  
  test('manage.njk is rendered', async () => {
    const users = mockService.getAll();
    await mockController.manage(reqMock, resMock)

    expect(mockService.getAll).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('user/views/manage.njk', {
      users
    })
  })

  test('view.njk is rendered', async () => {
    const { user, reservations } = mockService.getById(1);
    await mockController.view(reqMock, resMock)
    
    expect(mockService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('user/views/view.njk', {
      user,
      reservations
    })
  })

  test('view.njk throws an error when the user id is not defined', async () => {
    const reqMockNoId = {
      params: { userId: null}
    };
    await mockController.view(reqMockNoId, resMock)
    expect(resMock.render).toHaveBeenCalledWith('user/views/error.njk', { error: '' })
  })

  test('edit.njk is rendered', async() => {
    const { user } = mockService.getById(1);
    await mockController.edit(reqMock, resMock);

    expect(mockService.getById).toHaveBeenCalledTimes(2);
    expect(resMock.render).toHaveBeenCalledWith('user/views/edit.njk', {
      user
    })
  })

  test('edit.njk throws an error when the user id is not defined', async () => {
    const reqMockNoId = {
      params: { userId: null}
    };
    await mockController.edit(reqMockNoId, resMock)
    expect(resMock.render).toHaveBeenCalledWith('user/views/error.njk', { error: '' })
  })

  test('add.njk renders a form to add users', () => {
    mockController.add(reqMock, resMock);
    
    expect(resMock.render).toHaveBeenCalledWith('user/views/add.njk')
  })

  test('saves an user', async () => {
    const reqSaveMock = {
      body: {}
    };

    await mockController.save(reqSaveMock, resMock);
    expect(mockService.save).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('saving an user renders error.njk when an error is thrown', async () => {
    const reqSaveMock = {
      body: {}
    };
    
    mockService.save.mockRejectedValue(new Error('Test'))
    await mockController.save(reqSaveMock, resMock);
    expect(resMock.render).toHaveBeenCalledWith('user/views/error.njk', { error: 'Test' })
  })

  test('deletes an user', async () => {
    await mockController.delete(reqMock, resMock);

    expect(mockService.delete).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
  })

  test('deleting an user renders error.njk when an error is thrown', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error('Test')))
    await mockController.delete(reqMock, resMock);
    expect(resMock.render).toHaveBeenCalledWith('user/views/error.njk', { error: 'Test' })
  })
})