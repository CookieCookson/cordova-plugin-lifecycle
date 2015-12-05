(function() {
    var path = require('path');
    var xmlHelper = require('./xmlHelper.js');
    var CONFIG_FILE_NAME = 'config.xml';
    var context;
    var projectRoot;
    
    module.exports = ConfigXmlHelper;
    
    function ConfigXmlHelper(cordovaContext) {
        context = cordovaContext;
        projectRoot = context.opts.projectRoot;
    }
    
    ConfigXmlHelper.prototype.read = function() {
        var filePath = getConfigXmlFilePath();
        return xmlHelper.readXmlAsJson(filePath);
    }
    
    function getCordovaConfigParser(configFilePath) {
        var ConfigParser = context.requireCordovaModule('cordova-lib/src/configparser/ConfigParser');
        return new ConfigParser(configFilePath);
    }
    
    function getConfigXmlFilePath() {
        return path.join(projectRoot, CONFIG_FILE_NAME);
    }

})();