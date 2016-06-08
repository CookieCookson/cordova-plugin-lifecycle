/**
Hook is executed building the project after the prepare stage.
It will copy the alpha/beta specific icons to the platform directories.
It will also modify the iOS plist CFBundleIdentifier.
*/

var configParser = require('./lib/configXmlParser.js');
var fs = require('fs-extra');
var lwip = require('lwip');
var path = require('path');
var plist    = require('plist');
var parseXML = require('xml2js').parseString;

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

    // Get CLI commands sent through
    var cliCommand = process.argv.join();

    // Loop through each platform and generate alpha/beta icons
    var installedPlatforms = cordovaContext.opts.platforms;
    installedPlatforms.forEach(function(installedPlatform) {
        // If the android platform is installed and there are icons declared in config.xml
        if (installedPlatform === 'android' && platformIcons.android) {
            if (cliCommand.indexOf('store') === -1 && cliCommand.indexOf('beta') === -1) {
                generateAndroidIcons(platformIcons.android, 'alpha', alphaOverlay);
            } else if (cliCommand.indexOf('beta') > -1) {
                generateAndroidIcons(platformIcons.android, 'beta', betaOverlay);
            }
        }
        if (installedPlatform === 'ios') {
            // Set the product bundle identifier to the correct variant
            updateProductBundleIdentifier(cordovaContext);
            if (platformIcons.ios) {
                // Get variant type from command line
                // If the user has not specified the store or beta (fallback to alpha as primary)
                if (cliCommand.indexOf('--store') === -1 && cliCommand.indexOf('--beta') === -1) {
                    // Overwrite the icons for alpha
                    generateiOSIcons(cordovaContext, platformIcons.ios, 'alpha', alphaOverlay);
                } else if (cliCommand.indexOf('--beta') > -1) {
                    // Overwrite the icons for beta
                    generateiOSIcons(cordovaContext, platformIcons.ios, 'beta', betaOverlay);
                }
            }
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
                lwip.open(iconSource, function(size_error, image) {
                    if (size_error) {
                        console.log('Error getting size of source icons: ' + size_error);
                        throw size_error;
                    }
                    var iconWidth = image.width();
                    var iconHeight = image.height();
                    // Get overlay and resize it to dimensions of source icon
                    var overlay = lwip.open(iconOverlay, function(err_get_overlay, overlayImage) {
                        if (err_get_overlay) {
                            console.log('Error getting overlay image: ' + err_get_overlay);
                            throw err_get_overlay;
                        }
                        overlayImage.resize(iconWidth, iconHeight, 'lanczos', function(err_resize_overlay, resizedOverlayImage) {
                            if (err_resize_overlay) {
                                console.log('Error resizing overlay image: ' + err_resize_overlay);
                                throw err_get_overlay;
                            }
                            // Add on the overlay image to the icon
                            image.paste(0, 0, resizedOverlayImage, function(err_paste_overlay, combinedImage) {
                                if (err_paste_overlay) {
                                    console.log('Error pasting overlay image: ' + err_paste_overlay);
                                    throw err_get_overlay;
                                }
                                combinedImage.writeFile(iconDestinationFolder + 'icon.png', function(writeError) {
                                    if (writeError) {
                                        console.log('Error overlaying ' + variant + ' icon ' + iconSource + ': ' + error); 
                                        throw writeError;
                                    } else {
                                        console.log('Generated ' + variant + ' icon: ' + iconDestinationFolder + 'icon.png');
                                    }
                                });
                            });
                        });
                    });
                });
            } else {
                console.log('Error creating destination directory: ' + dir_error);
                throw dir_error;
            }
        });
    });
}

function generateiOSIcons(cordovaContext, iosIcons, variant, iconOverlay) {
    var projectRoot = cordovaContext.opts.projectRoot;
    var configFile = path.join(projectRoot, 'config.xml');
    parseXML(fs.readFileSync(configFile, 'utf8'), function(error, result) {
        if (error) {
            throw error;
        }
        var config = result.widget;
        var projectName = config.name[0].trim();
        var iconDestinationFolder = path.join(projectRoot, '/platforms/ios', projectName, '/Images.xcassets/AppIcon.appiconset/');
        iosIcons.forEach(function(icon) {
            var iconSource = icon.src;
            
            // Get size of source icon
            lwip.open(iconSource, function(size_error, image) {
                if (size_error) {
                    console.log('Error getting size of source icons: ' + size_error);
                    throw size_error;
                }
                var iconWidth = image.width();
                var iconHeight = image.height();
                var iconFilename = icon.src.split("/").pop();




                // Get overlay and resize it to dimensions of source icon
                var overlay = lwip.open(iconOverlay, function(err_get_overlay, overlayImage) {
                    if (err_get_overlay) {
                        console.log('Error getting overlay image: ' + err_get_overlay);
                        throw err_get_overlay;
                    }
                    overlayImage.resize(iconWidth, iconHeight, 'lanczos', function(err_resize_overlay, resizedOverlayImage) {
                        if (err_resize_overlay) {
                            console.log('Error resizing overlay image: ' + err_resize_overlay);
                            throw err_get_overlay;
                        }
                        // Add on the overlay image to the icon
                        image.paste(0, 0, resizedOverlayImage, function(err_paste_overlay, combinedImage) {
                            if (err_paste_overlay) {
                                console.log('Error pasting overlay image: ' + err_paste_overlay);
                                throw err_get_overlay;
                            }
                            combinedImage.writeFile(iconDestinationFolder + iconFilename, function(writeError) {
                                if (writeError) {
                                    console.log('Error overlaying ' + variant + ' icon ' + iconSource + ': ' + error);
                                    throw writeError;
                                } else {
                                    console.log('Generated ' + variant + ' icon: ' + iconDestinationFolder + iconFilename);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

// Updates the iOS Product Bundle Identifier to the correct variant
function updateProductBundleIdentifier(cordovaContext) {
    var cliCommand = process.argv.join();
    var PRODUCT_BUNDLE_IDENTIFIER = configParser.getApplicationId(cordovaContext);
    
    // Default to alpha variant
    var VARIANT_TYPE = 'alpha';
    // Get variant type from command line
    if (cliCommand.indexOf('--alpha') > -1) {
        VARIANT_TYPE = 'alpha';
    } else if (cliCommand.indexOf('--beta') > -1) {
        VARIANT_TYPE = 'beta';
    } else if (cliCommand.indexOf('--store') > -1) {
        VARIANT_TYPE = '';
    }
    
    // Append variant type to product bundle identifier if set in XXX-Info.plist
    if (VARIANT_TYPE !== '') {
        PRODUCT_BUNDLE_IDENTIFIER = PRODUCT_BUNDLE_IDENTIFIER + '.' + VARIANT_TYPE;
        // Change CFBundleIdentifier to new product bundle identifier
        var projectRoot = cordovaContext.opts.projectRoot;
        var configFile = path.join(projectRoot, 'config.xml');
        parseXML(fs.readFileSync(configFile, 'utf8'), function(error, result) {
            if (error) {
                throw error;
            }
            var config = result.widget;
            var projectName = config.name[0].trim();
            var plistFile = path.join(projectRoot, '/platforms/ios', projectName, projectName+'-Info.plist');
            var plistObj = plist.parse(fs.readFileSync(plistFile, 'utf8'));
            Object.assign(plistObj, {
                CFBundleIdentifier: PRODUCT_BUNDLE_IDENTIFIER
            });
            fs.writeFileSync(plistFile, plist.build(plistObj));
        });
    }
}

// Polyfill for Object.assign
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
