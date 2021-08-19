const mongodbUtils = require("./mongodb");

/**
 * 判断该群（私聊者）是否有权限使用插件
 * @param {Object} data MessageData
 * @param {String} pluginName 插件名称
 * @returns true|false
 */
exports.getPermission = async function (data, pluginName) {
    let doc;
    await mongodbUtils.getOneDocument("TestDB", "TestColl", { "name": pluginName }).then(res => {
        doc = Object(res);
    })
    if (data.message_type === "private") {
        return doc.isPrivate === "on";
    }
    let gid = data.group_id;
    return doc[gid.toString()] === "on"  // 群开关 
        && doc.switch === "on"       // 总开关
        && data.sender.level >= doc.level;  // 权限等级：1:全员可用 | 2:管理以上可用 | 3.仅群主可用
}