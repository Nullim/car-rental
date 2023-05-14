const { fromModelToEntity } = require ('../mapper/userMapper');
const userIdUndefined = require('../error/userIdUndefined');
const userUndefined = require('../error/userUndefined');
const userNotFound = require('../error/userNotFound');
const User = require('../entity/user');

module.exports = class UserRepository {
  /**
   * @param {typeof import('../model/userModel')} userModel
   */

  constructor(userModel){
    this.userModel = userModel;
  }

  async save(user) {
    if (!(user instanceof User)) {
      throw new userUndefined();
    }
    const userInstance = this.userModel.build(user, {
      isNewRecord: !user.id
    });
    await userInstance.save();
    return fromModelToEntity(userInstance);
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
    if(!Number(userId)) {
      throw new userIdUndefined();
    }
    const userInstance = await this.userModel.findByPk(userId);
    if(!userInstance) {
      throw new userNotFound();
    }
    return fromModelToEntity(userInstance);
  }

  async getAll() {
    const userList = await this.userModel.findAll();
    const users = userList.map((user) => fromModelToEntity(user));
    return users;
  }
}
