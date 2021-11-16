/**
 * 解析命令为cmd和args列表
 * @param {String} cmdStr 待解析字符
 * @returns Array
 */
function parseCommand(cmdStr) {
    if (!(cmdStr.startsWith("-") || cmdStr.startsWith("#"))) return [];
    if (cmdStr.startsWith("#set ")) {
        let rawKeyValue;
        if (cmdStr.indexOf('＝') !== -1) rawKeyValue = cmdStr.replace("#set ", "").split("＝");
        else rawKeyValue = cmdStr.replace("#set ", "").split("=");
        let key = rawKeyValue[0].trim();
        let value = rawKeyValue.slice(1, rawKeyValue.length).join("=").trimLeft();
        return ["#set", key, value]
    }
    if (cmdStr.trim().startsWith("-send ")) {
        let contents = cmdStr.slice(cmdStr.indexOf("-send ") + 6);
        return ["-send", contents]
    }
    if (cmdStr.trim().startsWith("#welcome ")) {
        let contents = cmdStr.slice(cmdStr.indexOf("#welcome ") + 9);
        return ["#welcome", contents]
    }
    if (cmdStr.trim().startsWith("-echo ")) {
        let contents = cmdStr.slice(cmdStr.indexOf("-echo ") + 6);
        return ["-echo", contents]
    }
    cmdStr = cmdStr.replace(/\s+/ig, ' ').trim();
    let list = cmdStr.split(" ");
    list[0] = list[0].toLowerCase();
    return list;
}
module.exports = parseCommand;