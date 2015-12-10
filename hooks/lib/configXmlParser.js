(function() {

    var ConfigXmlHelper = require('./configXmlHelper.js');

    module.exports = {
        getIcons: getIcons,
        getApplicationId: getApplicationId
    };

    function getIcons(cordovaContext) {
        var installedPlatforms = cordovaContext.opts.platforms;
        var configXml = new ConfigXmlHelper(cordovaContext).read();
        if (configXml == null) {
            console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
            return null;
        }

        var platformConfigPreferences = configXml.widget['platform'];
        var icons = [];

        installedPlatforms.forEach(function(installedPlatform) {
            platformConfigPreferences.forEach(function(configPlatform) {
                if (installedPlatform === configPlatform['$'].name) {
                    var platformIcons = {
                        'alpha': [],
                        'beta': []
                    };
        
                    var alphaIcons = configPlatform['alpha-icon'];
                    if (alphaIcons !== undefined) {
                        alphaIcons.forEach(function(alphaIcon) {
                            platformIcons.alpha.push(alphaIcon['$']);
                        });
                    }
        
                    var betaIcons = configPlatform['beta-icon'];
                    if (betaIcons !== undefined) {
                        betaIcons.forEach(function(betaIcon) {
                            platformIcons.beta.push(betaIcon['$']);
                        });            
                    }

                    icons[installedPlatform] = platformIcons;
                }
            });      
        });
        return icons;
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