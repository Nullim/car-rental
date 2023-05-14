const User = require('../entity/user');
const userIdUndefined = require('../error/userIdUndefined');
const userUndefined = require('../error/userUndefined');

module.exports = class UserService {
  /**
   * @param{import('../repository/userRepository')} userRepository
   */

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async save(user) {
    if(!(user instanceof User)) {
      throw new userUndefined();
    }
    return this.userRepository.save(user);
  }

  async getById(userId) {
    if(!Number(userId)) {
      throw new userIdUndefined();
    }
    return this.userRepository.getById(userId);
  }

  async delete(user) {
    return this.userRepository.delete(user);
  }

  async getAll() {
    return this.userRepository.getAll();
  }
}