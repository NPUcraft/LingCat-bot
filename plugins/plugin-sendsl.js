"use strict"
const { bot } = require("../index");
const { getPermission } = require("../lib/permission");


//-sendsl留言功能
async function sendsl(data, args) {
    if (!await getPermission(data, "sendsl")) return;
    if (args.length === 0) return;
    const where = data.group_name;
    const who = data.sender.nickname;
    bot.sendGroupMsg(710085830, `[${where}][${who}(${data.user_id})]:\n${args.join(" ")}`);
}
exports.sendsl = sendsl;