'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var path = require("path");

gulp.task('sass', function () {
  return gulp.src('./lacsso.scss')
    .pipe(sass({ includePaths: ['./**'] }))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./**/*.scss', ['sass']);
});

gulp.task('tag',       function() { return inc('patch'); })
gulp.task('tag-patch', function() { return inc('patch'); })
gulp.task('tag-minor', function() { return inc('minor'); })
gulp.task('tag-major', function() { return inc('major'); })

function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])
    // bump the version number in those files
    .pipe(bump({type: importance}))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('Bump release'))
    // read only one file to get the version number
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tag_version());
}
