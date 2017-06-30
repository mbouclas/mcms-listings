module.exports = (function (gulp,config,$) {
    'use strict';

    return function (){

        $.log('Copying minified files to listingion');
        return gulp
            .watch([
                config.optimizedDirJs,
                config.templatesDir
            ], ['copyToListingion','copyTemplatesToListingion']);
    }


});
