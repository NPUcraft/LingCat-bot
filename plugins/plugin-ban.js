"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const permissionDir = path.join(__dirname, "../config-template/config");
const permissionPath = permissionDir + "/permission.json";
const { getPermission } = require("../lib/permission");

async function banned(_bot, data) {
    // if (!await getPermission(data, "closeAll")) return;
    let permission = _readFileSync(permissionDir, "permission");
    const gid = String(data.group_id);

    if (data.duration > 0) {    // 被禁言
        permission[gid]["banned"] = true;
        fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
    } else if (data.duration === 0) {  // 被解除禁言
        permission[gid]["banned"] = false;
        fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
    }
}
exports.banned = banned;