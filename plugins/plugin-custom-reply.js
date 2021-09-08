"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const replyDir = path.join(__dirname, "../config-template/config");
const replyPath = replyDir + "/customReply.json";
const { getPermission } = require("../lib/permission");

async function setReply(data, key, value) {
    if (!await getPermission(data, "自定义回复")) return;
    if (value[1] == '') return;
    if (key.startsWith("[CQ:")) return;

    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    if (data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) === -1) {
        data.reply(`权限不足`);
        return;
    }
    replyData[gid]["reply"][key] = value;
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("添加成功");
}
exports.setReply = setReply;

async function deleteReply(data, args) {
    if (!await getPermission(data, "自定义回复")) return;
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    if (data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) === -1) {
        data.reply(`权限不足`);
        return;
    }
    args.forEach(elem => {
        delete replyData[gid]["reply"][elem];
    });
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("删除成功");
}
exports.deleteReply = deleteReply;

async function customReply(data, args) {
    if (!await getPermission(data, "自定义回复")) return;
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    let replyObj = replyData[gid]["reply"];
    data.reply(replyObj?.[args]);
}
exports.customReply = customReply;