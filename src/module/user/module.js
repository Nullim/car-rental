const UserController = require('./controller/userController');
const UserService = require('./service/userService');
const UserRepository = require('./repository/userRepository');
const UserModel = require('./model/userModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').IDIContainer} container
 */

function init (app, container) {
  /**
   * @type {UserController} controller;
   */
  const controller = container.get('UserController');
  controller.configureRoutes(app);
}

module.exports = {
  init,
  UserController,
  UserService,
  UserRepository,
  UserModel
}