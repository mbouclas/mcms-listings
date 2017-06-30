module.exports = (function (gulp,config,$) {
    'use strict';
    var path = require('path');

    return function (){
        var targetDir = config.publicDir;
        $.log('Publish everything');

        gulp
            .src(config.templatesDir)
            .pipe(gulp.dest(targetDir + 'app/templates'));

        gulp
            .src(config.cssDir)
            .pipe(gulp.dest(targetDir + 'css'));

        gulp
            .src(config.imgDir)
            .pipe(gulp.dest(targetDir + 'img'));

        gulp
            .src(config.jsDir)
            .pipe(gulp.dest(targetDir + 'js'));
    }
});
