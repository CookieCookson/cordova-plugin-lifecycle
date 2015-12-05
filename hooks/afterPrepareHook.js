var configParser = require('./lib/configXmlParser.js');
var fs = require('fs-extra')

module.exports = function(ctx) {
    run(ctx);
};

function run(cordovaContext) {
    var platformIcons = configParser.getIcons(cordovaContext);
    
    if (platformIcons == null) {
        return;
    }
    
    if (platformIcons.android !== undefined) {
        processAndroidIcons(platformIcons.android);
    }
}
    
function processAndroidIcons(androidIcons) {
    if (androidIcons.alpha !== undefined) {
        copyAndroidIcons(androidIcons.alpha, 'alpha');
    }
    
    if (androidIcons.beta !== undefined) {
        copyAndroidIcons(androidIcons.beta, 'beta');
    }
}
    
function copyAndroidIcons(androidIcons, state) {
    androidIcons.forEach(function(icon) {
        var iconSource = icon.src;
        var iconDestination = 'platforms/android/src/' + state + '/res/drawable-' + icon.density + '/icon.png';
        fs.copy(
            iconSource, 
            iconDestination, 
            {
                mkdirp: true
            },
            function(error) {
                if (error) {
                console.log( error);
                }
            }
        );
    });
}