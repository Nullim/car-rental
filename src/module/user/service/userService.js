module.exports = class UserService {
  /**
   * @param{import('../repository/userRepository')} userRepository
   */

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async save(user) {
    return this.userRepository.save(user);
  }

  async getById(userId) {
    return this.userRepository.getById(userId);
  }

  async delete(user) {
    return this.userRepository.delete(user);
  }

  async getAll() {
    return this.userRepository.getAll();
  }
}