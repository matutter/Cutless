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
      'DEBUG': '*'
    }
  })

});

gulp.task('compile_less', compile_less)

function compile_less() {
  exec('bash ./bin/compile-less.sh', (e, out, err) =>
    debug_less( (e || err ) || out) )
}

