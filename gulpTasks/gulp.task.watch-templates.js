module.exports = (function (gulp,config,$) {
    'use strict';

    return function (){

        $.log('Copying templates to listingion');
        return gulp
            .watch([
                config.templatesDir,
                config.cssDir,
                config.imgDir
            ], ['copyTemplatesToListingion','copyCssToListingion','copyImgToListingion']);
    }


});
