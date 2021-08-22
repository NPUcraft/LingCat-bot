const mongodbUtils = require("./mongodb");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;

/**
 * 判断该群（私聊者）是否有权限使用插件
 * @param {Object} data MessageData
 * @param {String} pluginName 插件名称
 * @returns true|false
 */
exports.getPermission = async function (data, pluginName) {
    const database = databaseInfo.database;
    const collection = databaseInfo.collection;
    pluginName = '_' + pluginName;
    let doc = await mongodbUtils.getOneDocument(database, collection, { "group_id": data.group_id });

    if (doc["banned"] === true) return false;
    let pluginInfo = doc[pluginName.toString()];

    return pluginInfo["activation"] === true
        && parseRole(data.sender.role) >= pluginInfo["level"];// 权限等级：1:全员可用 | 2:管理以上可用 | 3.仅群主可用
}

/**
 * 解析权限等级
 * @param {String} role 
 * @returns number
 */
function parseRole(role) {
    const OWNER = 3, ADMIN = 2, MEMBER = 1; // 等级权限
    if (role === "owner") {
        return OWNER;
    } else if (role === "admin") {
        return ADMIN;
    } else if (role === "member") {
        return MEMBER;
    } else {
        return 0;
    }
}