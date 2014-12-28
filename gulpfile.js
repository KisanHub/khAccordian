var pkg = require('./package.json');

var banner = '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n\n';

var gulp = require('gulp'),
    karma = require('karma').server,
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    header = require('gulp-header');

gulp.task('lint', function() {
  return gulp.src([
      'src/vAccordion/**/*.js',
      'test/**/*Spec.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', function() {
  gulp.src([
      'src/vAccordion/vAccordion.prefix',
      'src/vAccordion/**/*.js',
      'src/vAccordion/vAccordion.suffix'
    ])
    .pipe(concat('v-accordion.js'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('v-accordion.min.js'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'))
});

gulp.task('styles', function() {
  return gulp.src('src/vAccordion/styles/v-accordion.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(minifycss())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist/'))
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['lint', 'test', 'scripts', 'styles']);

gulp.task('watch', function() {
  gulp.watch('src/vAccordion/**/*.js', ['lint', 'scripts']);
  gulp.watch('src/vAccordion/styles/**/*.scss', ['styles']);
  gulp.watch('test/**/*Spec.js', ['lint', 'test']);
});