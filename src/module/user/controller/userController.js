const { fromFormToEntity } = require('../mapper/userMapper');
const userIdUndefined = require('../error/userIdUndefined');

module.exports = class UserController {
  /**
   * @param {import('../service/userService')} userService
   */

  constructor(userService) {
    console.log(userService)
    this.userService = userService
    this.ROUTE_BASE = '/user';
    this.USER_VIEWS = 'user/views'
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}/add`, this.add.bind(this));
    app.get(`${ROUTE}/view/:userId`, this.view.bind(this))
    app.get(`${ROUTE}/edit/:userId`, this.edit.bind(this));
    app.get(`${ROUTE}/manage`, this.manage.bind(this));
    app.post(`${ROUTE}/save`, this.save.bind(this));
    app.get(`${ROUTE}/delete/:userId`, this.delete.bind(this))
  }

  async view(req, res) {
    const { userId } = req.params;
    if (!Number(userId)) {
      throw new userIdUndefined();
    }
    const user = await this.userService.getById(userId);
    const birthday = new Date(user.birthday).toLocaleString(false, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC'
    })
    res.render(`${this.USER_VIEWS}/view.njk`, {
      user,
      birthday
    })
  }

  async manage(req, res) {
    const userList = await this.userService.getAll()
    const users = userList.map((user) => {
      const newUser = Object.assign(user);
      newUser.formattedBirthday = new Date(user.birthday).toLocaleString(false, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'UTC'
      });
      return newUser;
    })
    res.render(`${this.USER_VIEWS}/manage.njk`, {
      users
    })
  }

  add(req, res) {
    res.render(`${this.USER_VIEWS}/add.njk`)
  }

  async edit(req, res) {
    const { userId } = req.params;
    if (!Number(userId)) {
      throw new userIdUndefined();
    }
    const user = await this.userService.getById(userId);
    res.render(`${this.USER_VIEWS}/edit.njk`, {
      user
    })
  }

  async save(req, res) {
    const user = fromFormToEntity(req.body);
    await this.userService.save(user);
    res.redirect(`manage`)
  }

  async delete(req, res) {
    const { userId } = req.params;
    const user = await this.userService.getById(userId)
    this.userService.delete(user)
    res.redirect(`../manage`)
  }
}