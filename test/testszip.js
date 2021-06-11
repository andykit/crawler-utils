var szip = require("../src/utils/szip");
var path = require("path");

szip.zip('./test_zip', path.join(__dirname,"./test.zip")).then(()=>{
    szip.unzip('./test.zip', './test_zip_extracted');
});