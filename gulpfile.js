process.env.DEBUG = 'app*,db,user,ds.*,less'

const heapdump = require('heapdump')
const gulp = require('gulp')
const exec_process = require('child_process').exec
const debug_less = require('debug')('less')
const debug = require('debug')('dn.dbg')

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
      './app/'
    ],
    ext: 'js',
    env: {
      'NODE_ENV': 'development',
      'DEBUG': process.env.DEBUG
    }
  })

  compile_less()
  
});

gulp.task('compile-less', compile_less)

var heapdump_timeout = null
gulp.task('heapdump', function() {
  debug('Taking snapshots every 5 minutes')
  if(heapdump_timeout) return
  heapdump_timeout = setInterval(function() {
    takeSnapshot()
  }, 1000 * 60 *5)
})

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

function takeSnapshot() {
  debug('Taking snapshot')
  heapdump.writeSnapshot((e, filename) => {
    if(e) debug(e)
    debug('Written to %s', filename)
  })
}