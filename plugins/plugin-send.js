"use strict"
const { bot } = require("../index");
const fs = require("fs");
const path = require("path");
const { getPermission } = require("../lib/permission");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));

//-send留言功能
async function send(data, args) {
    if (!await getPermission(data, "send")) return;
    if (args.length === 0) return;
    const where = data.group_name;
    const who = data.sender.nickname;
    bot.sendGroupMsg(botInfo.owner, `[${where}][${who}(${data.user_id})]:\n${args.join(" ")}`);
}
exports.send = send;