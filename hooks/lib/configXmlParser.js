(function() {

    var ConfigXmlHelper = require('./configXmlHelper.js');

    module.exports = {
        getIcons: getIcons,
<<<<<<< HEAD
<<<<<<< HEAD
        getIconOverlay: getIconOverlay
=======
        getApplicationId: getApplicationId
>>>>>>> pass through variant app id to xcode plist
=======
        getApplicationId: getApplicationId
>>>>>>> 1f6a7f8f649b6f3cadff97738d0899f06c7020e6
    };
    
    function getIconOverlay(cordovaContext, variant) {
        var defaultIcon = cordovaContext.opts.plugin.dir + '/src/' + variant + '-overlay.png';
        
        var configXml = new ConfigXmlHelper(cordovaContext).read();
        if (configXml === null) {
            console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
            return null;
        }
        
        var iconOverlay = configXml.widget['icon-' + variant + '-overlay'];
        if (iconOverlay !== undefined) {
            return iconOverlay[0]['$'].src || defaultIcon;
        } else {
            return defaultIcon;
        }
    }

    function getIcons(cordovaContext) {
        var installedPlatforms = cordovaContext.opts.platforms;
        var configXml = new ConfigXmlHelper(cordovaContext).read();
        if (configXml == null) {
            console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
            return null;
        }

        var platformConfigPreferences = configXml.widget['platform'];
        var iconArray = [];

        installedPlatforms.forEach(function(installedPlatform) {
            platformConfigPreferences.forEach(function(configPlatform) {
                if (installedPlatform === configPlatform['$'].name) {
                    var icons = configPlatform['icon'];
                    var platformIconsArray = [];
                    if (icons !== undefined) {
                        icons.forEach(function(icon) {
                            platformIconsArray.push(icon['$']);
                        });
                    }
                    iconArray[installedPlatform] = platformIconsArray;
                }
            });      
        });
        return iconArray;
    }
    
    function getApplicationId(cordovaContext) {
        var configXml = new ConfigXmlHelper(cordovaContext).read();
        if (configXml == null) {
            console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
            return null;
        }
        return configXml['widget']['$']['id'];
    }
    
    function getApplicationId(cordovaContext) {
        var configXml = new ConfigXmlHelper(cordovaContext).read();
        if (configXml == null) {
            console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
            return null;
        }
        return configXml['widget']['$']['id'];
    }

})();