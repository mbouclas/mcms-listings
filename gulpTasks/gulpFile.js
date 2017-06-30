var gulp = require('gulp');
var args = require('yargs').argv;
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});
$.log = log;
$.clean = clean;
var Config = require('./gulp.config');

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
gulp.task('copyToListingion',[],require('./gulp.task.copyToListingion')(gulp,Config,$));
gulp.task('copyTemplatesToListingion',require('./gulp.task.copyTemplatesToListingion')(gulp,Config,$));
gulp.task('copyCssToListingion',require('./gulp.task.copyCssToListingion')(gulp,Config,$));
gulp.task('copyImgToListingion',require('./gulp.task.copyImagesToListingion')(gulp,Config,$));
gulp.task('watch',['copyToListingion','copyTemplatesToListingion'],require('./gulp.task.watch')(gulp,Config,$));
gulp.task('watch-templates',['copyTemplatesToListingion','copyCssToListingion','copyImgToListingion'],require('./gulp.task.watch-templates')(gulp,Config,$));

gulp.task('browserify',[],require('./gulp.task.browserify')(gulp,Config,$));
gulp.task('publish',['browserify','copyToListingion', 'copyTemplatesToListingion'],require('./gulp.task.publish')(gulp,Config,$));

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    fs.emptyDir(path,done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}