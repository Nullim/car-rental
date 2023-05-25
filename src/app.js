require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const configureDependencyInjection = require('./config/di');
const { init: initCarModule } = require('./module/car/module');
const { init: initUserModule } = require('./module/user/module');
const { init: initReservationModule } = require('./module/reservations/module')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

nunjucks.configure('src/module', { 
  autoescape: true,
  express: app
});

const container = configureDependencyInjection(app);

initCarModule(app, container);
initUserModule(app, container);
initReservationModule(app, container);

/**
 * @type {import('./module/car/controller/carController')} carController;
 */
const carController = container.get('CarController');
app.get('/', carController.index.bind(carController));

app.use((err, req, res, next) => {
  res.status(500).render('view/error.njk', { title: "Something went wrong!", error: err})
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
