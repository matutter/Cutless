process.env.DEBUG = 'app*,db,user,dn.*,less'

const gulp = require('gulp')
const exec_process = require('child_process').exec
const debug_less = require('debug')('less')

// stem the monitor race condition or multiple calls to a monitor
const monitor_lock = false

gulp.task('monitor', function() {
  const nodemon = require('gulp-nodemon')
  const watch = require('gulp-watch')

  if(monitor_lock) return
  monitor_locks = true

  watch('./static/less/**/*.less', {
    name: 'less-css',
    events: ['add', 'change']
  }, compile_less)

  nodemon({
    script: './server.js',
    watch: [
      './server.js',
      './lib/'
    ],
    ext: 'js',
    env: {
      'NODE_ENV': 'development',
      'DEBUG': process.env.DEBUG
    }
  })

});

gulp.task('compile-less', compile_less)

function compile_less() {
  debug_less('running')
  try {
      exec_process('bash ./bin/compile-less.sh', (e, out, err) => {
      debug_less( (e || err ) || out)
    })
  } catch(e) {
    debug_less(e)
  }
}

