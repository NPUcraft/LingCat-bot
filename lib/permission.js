const mongodbUtils = require("./mongodb");
const fs = require("fs");
const path = require("path");
const permissionPath = path.join(__dirname, "../config/permission.json");

/**
 * 判断该群（私聊者）是否有权限使用插件
 * @param {Object} data MessageData
 * @param {String} pluginName 插件名称
 * @returns true|false
 */
async function getPermission(data, pluginName) {
    pluginName = '_' + pluginName;
    const permission = JSON.parse(fs.readFileSync(permissionPath));
    const gid = String(data.group_id);
    let doc = permission?.[gid]

    if (!doc) return false;
    if (doc["banned"] === true) return false;

    let pluginInfo = doc[String(pluginName)];
    return pluginInfo["activation"] === true
        && (data.post_type === "notice" ? true : pluginInfo["isadmin"].indexOf(data.sender.role) !== -1);
}

exports.getPermission = getPermission;