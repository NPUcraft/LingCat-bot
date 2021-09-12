const path = require("path");
const fs = require("fs");
const { _readFileSync } = require("./file");
const permissionPath = path.join(__dirname, "../config-template/config");

/**
 * 判断该群（私聊者）是否有权限使用插件
 * @param {Object} data MessageData
 * @param {String} pluginName 插件名称
 * @returns true|false
 */
async function getPermission(data, pluginName) {
    pluginName = '_' + pluginName;
    let permission;
    try {
        permission = JSON.parse(fs.readFileSync(permissionPath + "/permission.json"));
    } catch (error) {
        if (error.code === 'ENOENT') return;
    }

    const gid = String(data.group_id);
    let doc = permission?.[gid]

    if (!doc) return false;
    if (doc["banned"] === true) return false;

    let pluginInfo = doc?.[String(pluginName)];
    return pluginInfo?.["activation"] === true
        && (data.post_type === "notice" ? true : pluginInfo?.["isadmin"].indexOf(data.sender.role) !== -1);
}

exports.getPermission = getPermission;