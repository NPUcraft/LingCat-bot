"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
const permissionDir = path.join(__dirname, "../config-template/config");
const permissionPath = permissionDir + "/permission.json";
const replyDir = path.join(__dirname, "../config-template/config");
const replyPath = replyDir + "/customReply.json";
const help = `
<#install> 为本群安装机器人服务
<#update> 为本群更新到最新的机器人版本
`.trim();

async function install(_bot, data, args = null) {
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    const gid = String(data.group_id);
    if (["admin", "owner"].indexOf(data.sender.role) === -1) return;    // 仅管理员可以安装机器人

    /* 配置权限 */
    let permission = _readFileSync(permissionDir, "permission");
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
    let permissionTemp = JSON.parse(fs.readFileSync(path.join(__dirname, "../config-template/permission-template.json")));
    permissionTemp = permissionTemp["example"];
    permission[gid] = JSON.parse(JSON.stringify(permissionTemp));
    permission[gid]["group_id"] = data.group_id;
    permission[gid]["version"] = botInfo.version;
    fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));

    /* 配置自定义回复 */
    let customReply = _readFileSync(replyDir, "customReply");
    let customReplyTemp = JSON.parse(fs.readFileSync(path.join(__dirname, "../config-template/customReply-template.json")));
    customReplyTemp = customReplyTemp["example"];
    customReply[gid] = JSON.parse(JSON.stringify(customReplyTemp));
    customReply[gid]["group_id"] = data.group_id;
    fs.writeFileSync(replyPath, JSON.stringify(customReply, null, '\t'));

    data.reply(`温柔甜美的${botInfo.botNickname}已被带回家~`);
}

async function update(_bot, data, args = null) {
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    const gid = String(data.group_id);
    let permission = _readFileSync(permissionDir, "permission");
    if (typeof permission?.[gid] === "undefined") {
        data.reply("未安装！请管理员先使用#install进行安装");
        return;
    }
    let permissionTemp = JSON.parse(fs.readFileSync(path.join(__dirname, "../config-template/permission-template.json")));
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
    for (const key in permissionTemp["example"]) {
        if (groupPlugin.indexOf(key) === -1) {
            permission[gid][key] = permissionTemp["example"][key];
        }
    }
    fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
    data.reply(`[V${currentVer} -> V${botInfo.version}]\n我变得更加温柔咯~`);
}

exports.update = update;
exports.install = install;