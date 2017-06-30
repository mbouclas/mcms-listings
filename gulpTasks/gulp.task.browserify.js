module.exports = (function (gulp, config, $) {
    'use strict';

    return function () {

        $.log('Browserify');

        gulp.src(config.appDir + 'app.js')
            .pipe($.browserify({}))
            .pipe($.rename('listings-compiled.js'))
            .pipe(gulp.dest(config.publicDir + 'js/'));

    }


});
