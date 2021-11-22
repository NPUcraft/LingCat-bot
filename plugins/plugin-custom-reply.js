"use strict"
const fs = require("fs");
const { arg } = require("mathjs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const replyDir = path.join(__dirname, "../config-template/config");
const accountInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../account.json")));
const replyPath = replyDir + "/customReply.json";
const { getPermission } = require("../lib/permission");
const help = `
查看自定义回复触发词列表
`.trim();

async function setReply(_bot, data, key, value) { 
    if (!await getPermission(data, "自定义回复")) return; // 检测功能是否开启
    if (key.startsWith("[CQ:")) return; // CQ码开头的消息不触发功能

    // 检测权限
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    if (!((data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) !== -1) // 检测发消息者是不是超级用户
        || Number(accountInfo["owner"]) == data.user_id                                               // 检测发消息者是不是号主
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {                                    // 检测发消息者是不是管理
        data.reply("权限不足");
        return;
    }

    // 添加失败
    if (typeof value?.[0] === "undefined") {
        data.reply("添加失败！请设置回复内容");
        return;
    }
    if (typeof key?.[0] === "undefined") {
        data.reply("添加失败！请设置回复关键词");
        return;
    }

    // 添加成功
    replyData[gid]["reply"][key] = value;
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("添加成功");
}
exports.setReply = setReply;

async function deleteReply(_bot, data, args) {
    if (!await getPermission(data, "自定义回复")) return;

    // 检测权限
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    if (!((data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) !== -1)
        || Number(accountInfo["owner"]) == data.user_id
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {
        data.reply("权限不足");
        return;
    }

    // 删除失败
    if (typeof args?.[0] === "undefined") {
        data.reply("删除失败！请指定关键词");
        return;
    }
    if (args.findIndex(elem => {return replyData[gid]["reply"][elem];}) == -1) {
        data.reply("删除失败！关键词不存在");
        return;
    }

    // 删除成功
    args.forEach(elem => {
        delete replyData[gid]["reply"][elem];
    });
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("删除成功");
}
exports.deleteReply = deleteReply;

async function customReply(_bot, data, args) {
    if (!await getPermission(data, "自定义回复")) return;
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    let replyObj = replyData[gid]["reply"];
    data.reply(replyObj?.[args]);
}
exports.customReply = customReply;

async function getReplyList(_bot, data, args = null) {
    if (!await getPermission(data, "自定义回复")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customReply");
    let replyObj = replyData[gid]["reply"];
    let replyList = [];
    for (const key in replyObj) {
        replyList.push(key);
    }
    data.reply(`窝的小本本给你看看：\n[ ${replyList.join(" | ")} ]`);
}
exports.getReplyList = getReplyList;