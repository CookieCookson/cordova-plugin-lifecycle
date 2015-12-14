var configParser = require('./lib/configXmlParser.js');
var fs = require('fs-extra');
var gm = require('gm');

module.exports = function(ctx) {
    run(ctx);
};

function run(cordovaContext) {
    // Retrieve overlay image from config.xml or provide fallback image with plugin
    var alphaOverlay = configParser.getIconOverlay(cordovaContext, 'alpha');
    var betaOverlay = configParser.getIconOverlay(cordovaContext, 'beta');

    // Retrieve platform icons declared in config.xml
    var platformIcons = configParser.getIcons(cordovaContext);
    if (platformIcons === null) {
        return;
    }

    // Loop through each platform and generate alpha/beta icons
    var installedPlatforms = cordovaContext.opts.platforms;
    installedPlatforms.forEach(function(installedPlatform) {
        // If the android platform is installed and there are icons declared in config.xml
       if (installedPlatform === 'android' && platformIcons.android) {
            generateAndroidIcons(platformIcons.android, 'alpha', alphaOverlay);
            generateAndroidIcons(platformIcons.android, 'beta', betaOverlay);
       }
    });
}

function generateAndroidIcons(androidIcons, variant, iconOverlay) {
    // Loop through each android icon declaration
    androidIcons.forEach(function(icon) {
        var iconSource = icon.src;
        var iconDestinationFolder = 'platforms/android/src/' + variant + '/res/drawable-' + icon.density + '/';
        
        // Create destination directory
        fs.ensureDir(iconDestinationFolder, function(dir_error) {
            if (!dir_error) {
                // Get size of source icon
                gm(iconSource)
                .size(function(size_error, size) {
                    if (!size_error) {
                        var iconWidth = size.width;
                        var iconHeight = size.height;
                        // add icon overlay to source icon and write it to the variant destination
                        gm(iconSource)
                        .draw(['image over 0,0 ' + iconWidth + ','+iconHeight + ' "' + iconOverlay + '"'])
                        .write(iconDestinationFolder + 'icon.png', function(error){
                            if (error) {
                                console.log('Error overlaying ' + variant + ' icon ' + iconSource + ': ' + error); 
                            } else { 
                                console.log('Generated ' + variant + ' icon: ' + iconDestinationFolder + 'icon.png');
                            }
                        });
                    } else {
                        console.log('Error getting size of source icons: ' + size_error);
                    }
                });
            } else {
                console.log('Error creating destination directory: ' + dir_error);
            }
        });
    });
}
