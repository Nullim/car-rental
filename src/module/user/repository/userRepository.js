const { fromDbToEntity } = require ('../mapper/userMapper');

module.exports = class UserRepository {
  /**
   * @param {typeof import('../model/userModel')} userModel
   */

  constructor(userModel){
    this.userModel = userModel;
  }

  async save(user) {
    const userInstance = this.userModel.build(user, {
      isNewRecord: !user.id
    });
    await userInstance.save();
    return fromDbToEntity(userInstance);
  }

  async delete(user) {
    return Boolean(
      await this.userModel.destroy({
        where: {
          id: user.id
        }
      })
    )
  }

  async getById(userId) {
    const userInstance = await this.userModel.findByPk(userId);
    return fromDbToEntity(userInstance);
  }

  async getAll() {
    const userList = await this.userModel.findAll();
    const users = userList.map((user) => fromDbToEntity(user));
    return users;
  }
}
