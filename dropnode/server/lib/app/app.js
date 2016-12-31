module.exports.App = App

const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const Server = require('./server.js')

// feature controllers
const MainController = require('./controllers/main').MainController
const UserController = require('./controllers/user').UserController

const debug = require('debug')('app')
const debug_route = require('debug')('route')

/**
* Main application controller
*/
function App(opts, api) {
  const app = express()
  const port = opts.server.port
  //const s_opts = opts.session
  const server = Server.createServer(app, port)
  //const db = new Database(opts.database, logger)

  this.api = api
  this.getServer = () => server
  this.all = app.all.bind(app)
  this.get = app.get.bind(app)
  this.use = app.use.bind(app)
  this.post = app.post.bind(app)
  this.param = app.param.bind(app)

  //s_opts.cookie = s_opts.cookie || {};

  //if(s_opts.cookie.secure)
  //  app.set('trust proxy', 1)

  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use('/js', express.static('node_modules/bootstrap/dist/js'));
  app.use('/css', express.static('node_modules/bootstrap/dist/css'));

  app.use('/js', express.static('node_modules/bootstrap-material-design/dist/js'));
  app.use('/css', express.static('node_modules/bootstrap-material-design/dist/css'));
  
  app.use('/js', express.static('node_modules/jquery/dist'));
  app.use('/css', express.static('static/css/'));
  app.use('/js', express.static('static/js/'));
  app.use('/img', express.static('static/img/'));

  app.use((req, res, next) => {
    //debug_route('%s | %s', req.method, req.url)
    //res.locals.logged_in = true
    next()
  })

  //app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(session(s_opts));

  this.main = new MainController(this);
  this.user = new UserController(this);
};

/**
* Connects the MongoDB driver and begins listening to the config.server.port
* @return Promise
* @promise - Reference to the App object is supplied on success
*/
App.prototype.listen = function() {
  const server = this.getServer()
  
  return this.api.db.connect()
    .then(server.listen)
    .then(() => debug('listening on port %d', server.port))
    .then(() => this)
};
