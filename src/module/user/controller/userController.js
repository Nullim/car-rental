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
    try {
      const { userId } = req.params;
      if (!Number(userId)) {
        throw new userIdUndefined();
      }
      const { user, reservations } = await this.userService.getById(userId);
      res.render(`${this.USER_VIEWS}/view.njk`, {
        user,
        reservations
      })
    } catch (e) {
      res.render(`${this.USER_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async manage(req, res) {
    const users = await this.userService.getAll()
    res.render(`${this.USER_VIEWS}/manage.njk`, {
      users
    })
  }

  add(req, res) {
    res.render(`${this.USER_VIEWS}/add.njk`)
  }

  async edit(req, res) {
    try {
      const { userId } = req.params;
      if (!Number(userId)) {
        throw new userIdUndefined();
      }
      const { user } = await this.userService.getById(userId);
      res.render(`${this.USER_VIEWS}/edit.njk`, {
        user
      })
    } catch (e) {
      res.render(`${this.USER_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async save(req, res) {
    try {
      const user = fromFormToEntity(req.body);
      await this.userService.save(user);
      res.redirect(`manage`)
    } catch (e) {
      res.render(`${this.USER_VIEWS}/error.njk`, { error: e.message})
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req.params;
      const user = await this.userService.getById(userId)
      this.userService.delete(user)
      res.redirect(`../manage`)
    } catch (e) {
      res.render(`${this.USER_VIEWS}/error.njk`, { error: e.message})
    }
  }
}