const { fromModelToEntity } = require ('../mapper/userMapper');
const { fromModelToEntity: fromReservationModelToEntity } = require ('../../reservations/mapper/reservationMapper');
const userIdUndefined = require('../error/userIdUndefined');
const userUndefined = require('../error/userUndefined');
const userNotFound = require('../error/userNotFound');
const User = require('../entity/user');
const ReservationsModel = require('../../reservations/model/reservationsModel');

module.exports = class UserRepository {
  /**
   * @param {typeof import('../model/userModel')} userModel
   */

  constructor(userModel){
    this.userModel = userModel;
  }

  async save(user) {
    if (!(user instanceof User)) {
      throw new userUndefined("User has invalid parameters");
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
      throw new userIdUndefined(`The user with ID ${userId} does not exist`);
    }
    const userInstance = await this.userModel.findByPk(userId, {include: ReservationsModel});
    if(!userInstance) {
      throw new userNotFound("User does not exist");
    }
    const user = fromModelToEntity(userInstance);
    const reservations = userInstance.Reservations.map((instance) => 
      fromReservationModelToEntity(instance)
    )

    return { user, reservations };
  }

  async getAll() {
    const userList = await this.userModel.findAll();
    const users = userList.map((user) => fromModelToEntity(user));
    return users;
  }
}
