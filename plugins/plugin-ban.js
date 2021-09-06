"use strict"
const fs = require("fs");
const path = require("path");
const permissionPath = path.join(__dirname, "../config/permission.json");
const { getPermission } = require("../lib/permission");

function banned(data) {
    if (!await getPermission(data, "closeAll")) return;
    let permission = JSON.parse(fs.readFileSync(permissionPath));
    const gid = String(data.group_id);

    if (data.duration > 0) {    // 被禁言
        permission[gid]["banned"] = true;
        fs.writeFileSync(permissionPath, JSON.stringify(permission));
    } else if (data.duration === 0) {  // 被解除禁言
        permission[gid]["banned"] = false;
        fs.writeFileSync(permissionPath, JSON.stringify(permission));
    }
}
exports.banned = banned;