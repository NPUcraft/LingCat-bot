"use strict"
const fs = require("fs");
const path = require("path");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
const permissionPath = path.join(__dirname, "../config/permission.json");

async function install(data, args = null) {
    const gid = String(data.group_id);
    if (["admin", "owner"].indexOf(data.sender.role) === -1) return;    // 仅管理员可以安装机器人
    let permission = JSON.parse(fs.readFileSync(permissionPath));
    let installedGroup = [];
    for (const key in permission) {
        if (key === 'example') continue;
        installedGroup.push(key)
    }
    if (installedGroup.indexOf(gid) !== -1) { // 已存在退出
        data.reply(`已领养${botInfo.botNickname}咯~`);
        return;
    }
    // 配置该群相关参数
    const template = permission["example"];
    permission[gid] = JSON.parse(JSON.stringify(template));
    permission[gid]["group_id"] = data.group_id;
    permission[gid]["version"] = botInfo.version;
    fs.writeFileSync(permissionPath, JSON.stringify(permission));
    data.reply(`温柔甜美的${botInfo.botNickname}已被带回家~`);
}

async function update(data, args = null) {
    const gid = String(data.group_id);
    let permission = JSON.parse(fs.readFileSync(permissionPath));
    let currentVer = permission[gid]["version"];
    if (botInfo.version === currentVer) {
        data.reply(`已是最新版本:[V${botInfo.version}]`);
        return;
    }
    permission[gid]["version"] = botInfo.version;
    const groupPlugin = [];
    for (const key in permission[gid]) {
        groupPlugin.push(key)
    }   // 获取当前群插件列表
    for (const key in permission["example"]) {
        if (groupPlugin.indexOf(key) === -1) {
            permission[gid][key] = permission["example"][key];
        }
    }
    fs.writeFileSync(permissionPath, JSON.stringify(permission));
    data.reply(`[V${currentVer} -> V${botInfo.version}]\n我变得更加温柔咯~`);
}

exports.update = update;
exports.install = install;