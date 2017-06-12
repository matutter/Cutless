// Global setup
global.Promise = require('bluebird');

// ensure server is running here before relative imports
process.chdir(__dirname);

// dropsite libs
const os = require('os');
const path = require('path');
const mkdirp = require('mkdirp');
const debug = require('debug')('app.init');
const opts = global.config = require('./config/default.json');


opts.tempdir = opts.tempdir || '/tmp/dropsite';
opts.userdir = opts.userdir || '/tmp/dropsite/userdata';
opts.userdir_images = path.join(opts.userdir, 'profile_images');

mkdirp_important(opts.tempdir);
mkdirp_important(opts.userdir);
mkdirp_important(opts.userdir_images);

const Site = require('./app/core');
const App = require('./app/app.js');

const api = new Site(global.config);
const app = new App(api, global.config).listen(app => {
  debug(`Available on ${app.server.port}`);
});

function mkdirp_important(path) {
  debug('ensure directory %s', path);
  
  mkdirp(path, e => {
    if(e) {
      console.error(e);
      exit(e.code || 1);
    }
  });
}