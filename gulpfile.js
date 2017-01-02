process.env['DEBUG'] = '*'

const gulp = require('gulp');
const exec = require('child_process').exec
const debug_less = require('debug')('less')

gulp.task('monitor', function() {
  const nodemon = require('gulp-nodemon')
  const watch = require('gulp-watch')

  watch('./static/less/**/*.less', {
    name: 'less-css',
    events: ['add', 'change']
  }, onLess)

  nodemon({
    script: './server.js',
    watch: [
      './server.js',
      './lib/'
    ],
    ext: 'js',
    env: {
      'NODE_ENV': 'development',
      'DEBUG': '*'
    }
  })

});

function onLess(record) {
  exec('bash ./bin/compile-less.sh', (e, out, err) =>
    debug_less( (e || err ) || out) )
}
