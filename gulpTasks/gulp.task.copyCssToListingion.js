module.exports = (function (gulp,config,$) {
    'use strict';

    return function (){

        $.log('Copying css files to listingion');
        return gulp
            .src(config.cssDir)
            .pipe(gulp.dest(config.publicDirCss));
    }


});
