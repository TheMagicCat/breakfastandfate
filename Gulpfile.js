var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");
var pump = require('pump');
// const zlib = require('zlib');

gulp.task('compress', function () {
  return gulp.src('js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['compress']);