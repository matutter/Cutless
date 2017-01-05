module.exports.App = App

const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const createServer = require('./server.js').createServer

// feature controllers
const MainController = require('./controllers/main.js')
const UserController = require('./controllers/user.js')

const debug = require('debug')('dn.app')
//const debug_route = require('debug')('route')

const module_dir = 'node_modules'

/**
* Main application controller
*/
function App(opts, api) {
  const app = express()

  this.app = app
  this.api = api
  this.server = createServer(app, opts.server.port || 80)

  //const s_opts = opts.session 
  //s_opts.cookie = s_opts.cookie || {};
  //if(s_opts.cookie.secure)
  //  app.set('trust proxy', 1)

  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use('/js', express.static(module_dir+'/bootstrap/dist/js'));
  app.use('/css', express.static(module_dir+'/bootstrap/dist/css'));

  app.use('/js', express.static(module_dir+'/bootstrap-material-design/dist/js'));
  app.use('/css', express.static(module_dir+'/bootstrap-material-design/dist/css'));
  
  app.use('/js', express.static(module_dir+'/jquery/dist'));
  app.use('/css', express.static('static/css/'));
  app.use('/js', express.static('static/js/'));
  app.use('/img', express.static('static/img/'));

  //app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(session(s_opts));
  
  this.main = new MainController(this);
  this.user = new UserController(this);
}

/**
* Connects the MongoDB driver and begins listening to the config.server.port
* @return Promise
* @promise - Reference to the App object is supplied on success
*/
App.prototype.listen = function() {
  return this.api.connect()
    .then(this.server.listen)
    .tap(() => debug('listening on port %d', this.server.port))
    .return(this)
};
