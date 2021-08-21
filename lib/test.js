const mongodbUtils = require("./mongodb");
const { limitedEvaluate } = require("./limited-evaluate");

(async () => {
    let dataObj = limitedEvaluate("sqrt(2)2+2")
    console.log(dataObj)
})();
