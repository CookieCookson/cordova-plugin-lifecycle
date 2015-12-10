var configParser = require('./lib/configXmlParser.js');
var fs = require('fs-extra');
var path = require('path');
var plist    = require('plist');
var parseXML = require('xml2js').parseString;

module.exports = function(ctx) {
    run(ctx);
};

function run(cordovaContext) {
    // Copy variant icons from config.xml to platform directories
    var platformIcons = configParser.getIcons(cordovaContext);
    if (platformIcons === null) {
        if (platformIcons.android !== undefined) {
            processAndroidIcons(platformIcons.android);
        }
    }
    
    var platforms = cordovaContext.opts.platforms;
    for (var x=0; x<platforms.length; x++) {
        var platform = platforms[x].trim().toLowerCase();
        if (platform === "ios") {
            updateProductBundleIdentifier(cordovaContext);
        }
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
    
    // Append variant type to product bundle identifier if set
    if (VARIANT_TYPE !== '') {
        PRODUCT_BUNDLE_IDENTIFIER = PRODUCT_BUNDLE_IDENTIFIER + '.' + VARIANT_TYPE;
        // Change CFBundleIdentifier to new product bundle identifier
        var projectRoot = cordovaContext.opts.projectRoot;
        var configFile = path.join(projectRoot, 'config.xml');
        parseXML(fs.readFileSync(configFile, 'utf8'), function(err, result) {
        if (err) { throw err; }
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