module.exports = App

const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const sessions = require('client-sessions')

const createServer = require('./server.js').createServer

// feature controllers
const MainController = require('./core/main.js')
const UserController = require('./users/controller.js')

const debug = require('debug')('ds.app.server')
//const debug_route = require('debug')('route')

const module_dir = 'node_modules'

/**
* Main application controller
*/
function App(api, opts) {
  const app = express()

  this.app = app
  this.api = api
  this.server = createServer(app, opts.server.port || 80)
	this.tempdir = opts.tempdir
	this.userdir = opts.userdir

  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use('/js', static('/bootstrap/dist/js', true));
  app.use('/css', static('/bootstrap/dist/css', true));
  app.use('/fonts', static('/bootstrap/fonts', true));
  
  app.use('/js', static('/jquery/dist', true));
  app.use('/css', static('static/css/'));
  app.use('/js', static('static/js/'));
  app.use('/img', static('static/img/'));

  app.use('/plugin/quill', static('/quill/dist', true))

	app.use(sessions({
		requestKey: 'session',
		cookieName: 'dnses',
		secret: 'secret1234',
		duration: 24 * 60 * 60 * 1000,
		activeDuration: 1000 * 60 * 5
	}))
  
  app.all('*', (req, res, next) => {
    req.json = ~req.url.indexOf('json');
    
    if(req.session.user) {
      this.api.users.verifySession(req.session.user).then( user => {
        
        if(user) {
          req.session.user = user.public()
          res.locals.user = user
        } else {
          res.locals.user = false          
        }

        next()
      })
    } else {
      res.locals.session = false
      next()
    }
  })
  
  //app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(session(s_opts));
  
  this.main = new MainController(this);
  this.user = new UserController(this);
  
  app.use(this.catchAll.bind(this))
}

/**
* Connects the MongoDB driver and begins listening to the config.server.port
* @param cb {callback *} Resolves into a this reference once the server is listening on a socket. 
* @return Promise
* @promise - Reference to the App object is supplied on success
*/
App.prototype.listen = function(cb) {
  var promise = this.api.connect()
    .then(this.server.listen)
    .return(this)
	
	if(cb) {
		promise.then(cb)
	}
	
	return this
};

App.prototype.catchAll = function(e, req, res, next) {
  if (e.bubble) {
    res.status(e.status).json(e)
  } else {
    next(e.message) 
  }
}

function static(dirpath, isModule) {
	if(isModule) {
		dirpath = path.join(module_dir, dirpath)
	}
	if(process.env.NODE_ENV == 'development') {
		return express.static(dirpath, {etag: false})
	} else {
		return express.static(dirpath)
	}
}