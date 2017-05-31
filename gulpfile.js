process.env.DEBUG = 'app*,db,user,ds.*,less'

const gulp = require('gulp')
const exec_process = require('child_process').exec
const debug_less = require('debug')('less')
const debug = require('debug')('dn.dbg')

// stem the monitor race condition or multiple calls to a monitor
const monitor_lock = false

gulp.task('monitor', [ 'nodemon', 'lessmon' ]);

gulp.task('lessmon', function() {
  const watch = require('gulp-watch')

  watch('./static/less/**/*.less', {
    name: 'less-css',
    events: ['add', 'change']
  }, compile_less)

  compile_less()

});

gulp.task('nodemon', function() {
  const nodemon = require('gulp-nodemon')

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
  });
});

gulp.task('compile-less', compile_less)

//var heapdump_timeout = null
gulp.task('heapdump', function() {
  //const heapdump = require('heapdump')

  //debug('Taking snapshots every 5 minutes')
  //if(heapdump_timeout) return

  //heapdump_timeout = setInterval(function() {
  //  takeSnapshot()
  //}, 1000 * 60 *5)
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
  //const heapdump = require('heapdump');

  //heapdump.writeSnapshot((e, filename) => {
  //  if(e) debug(e)
  //  debug('Written to %s', filename)
  //})
}
