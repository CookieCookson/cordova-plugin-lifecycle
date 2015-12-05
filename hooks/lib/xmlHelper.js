(function() {

    var fs = require('fs');
    var xml2js = require('xml2js');
    
    module.exports = {
        readXmlAsJson: readXmlAsJson
    };
    
    function readXmlAsJson(filePath) {
        var xmlData;
        var xmlParser;
        var parsedData;
    
        try {
            xmlData = fs.readFileSync(filePath);
            xmlParser = new xml2js.Parser();
            xmlParser.parseString(xmlData, function(err, data) {
                if (data) {
                    parsedData = data;
                }
            });
        } catch (err) {}
        return parsedData;
    }

})();