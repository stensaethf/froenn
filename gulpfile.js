var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var mocha = require('gulp-mocha');
var jade = require('gulp-jade');
var through = require('through2');
var path = require('path');

var PRODUCTION = process.env.FROENNDEV !== '1';

// edits the function name of the jade function
// send to the browser
function modify_jade() {
  function transform(file, enc, callback) {
    if (!file.isBuffer()) {
      this.push(file);
      callback();
      return;
    }
    var filename = path.basename(file.path, '.js');
    var contents = file.contents.toString();
    contents = "(function() {" +
               contents +
               ";window.templates = window.templates || {}" +
               ";window.templates['" + filename + "'] = template;})();";
    file.contents = new Buffer(contents);
    this.push(file);
    callback();
  }
  return through.obj(transform);
}

gulp.task('default', ['build', 'watch']);

gulp.task('watch', function() {
    gulp.watch('assets/scss/*', ['sass']);
    gulp.watch('assets/js/*', ['js']);
    gulp.watch('assets/js/vendor/*', ['jsvendor']);
    gulp.watch('assets/images/*', ['images']);
    gulp.watch('views/shared/*', ['jade']);
});

gulp.task('build', ['sass', 'images', 'documents', 'js', 'jsvendor', 'jade']);

gulp.task('sass', function() {
    gulp.src(['./assets/scss/all.scss'])
        .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('images', function() {
    gulp.src('./assets/images/**')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('documents', function() {
    gulp.src('./assets/documents/**')
        .pipe(gulp.dest('./public/documents'));
});

gulp.task('js', function() {
    var lint = gulp.src('./assets/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

    var output = gulp.src(['./assets/js/*.js'])
        .pipe(sourcemaps.init())
            .pipe(concat('all.js', {newLine: ';'}))
            .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'));

    return merge(lint, output);
});

gulp.task('jsvendor', function() {
    return gulp.src(['./assets/js/vendor/*.js'])
        .pipe(sourcemaps.init())
            .pipe(concat('vendor.js', {newLine: ';'}))
            .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('jade', function() {
  var YOUR_LOCALS = {};
  gulp.src('./views/shared/*.jade')
    .pipe(jade({client: true}))
    .pipe(modify_jade())
    .pipe(concat("templates.js", {newLine: ';'}))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('lint', function() {
    var lint = gulp.src(['./assets/js/*.js', './models/*.js', './routes/*.js', './*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});