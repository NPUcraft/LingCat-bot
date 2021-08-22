
/**
 * 解析命令为cmd和args列表
 * @param {String} cmdStr 待解析字符
 * @returns Array
 */
function parseCommand(cmdStr) {
    if (!(cmdStr.trim().startsWith("-") || cmdStr.trim().startsWith("#"))) return [];
    cmdStr = cmdStr.replace(/\s+/ig, ' ').trim();
    let list = cmdStr.split(" ");
    list[0] = list[0].toLowerCase();
    return list;
}
module.exports = parseCommand;