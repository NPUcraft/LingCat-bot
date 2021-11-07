/**
 * 解析命令为cmd和args列表
 * @param {String} cmdStr 待解析字符
 * @returns Array
 */
function parseCommand(cmdStr) {
    if (!(cmdStr.trim().startsWith("-") || cmdStr.trim().startsWith("#"))) return [];
    if (cmdStr.startsWith("#set ")) {
        let rawKeyValue;
        if (cmdStr.indexOf('＝') !== -1) rawKeyValue = cmdStr.replace("#set ", "").split("＝");
        else rawKeyValue = cmdStr.replace("#set ", "").split("=");
        let key = rawKeyValue[0].trim();
        let value = rawKeyValue.slice(1, rawKeyValue.length).join("=").trimLeft();
        return ["#set", key, value]
    }
    if (cmdStr.startsWith("-sendsl ")) {
        let contents = cmdStr.replace("-sendsl ", "");
        return ["-sendsl", contents]
    }
    if (cmdStr.startsWith("-echo ")) {
        let contents = cmdStr.replace("-echo ", "");
        return ["-echo", contents]
    }
    cmdStr = cmdStr.replace(/\s+/ig, ' ').trim();
    let list = cmdStr.split(" ");
    list[0] = list[0].toLowerCase();
    return list;
}
module.exports = parseCommand;