const fs = require("fs");
const path = require("path")


function _readFileSync(dirPath, template) {
    let content;
    const readPath = dirPath + "/" + template + ".json";
    try {
        content = fs.readFileSync(readPath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            if (!fs.existsSync(dirPath)) fs.mkdirSync(path.join(dirPath));
            fs.writeFileSync(readPath, JSON.stringify({}, null, '\t'));
            content = fs.readFileSync(readPath);
        }
    }
    return JSON.parse(content);
}

exports._readFileSync = _readFileSync;