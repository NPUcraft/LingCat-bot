"use strict"
const { getPermission } = require("../lib/permission");
const { segment } = require("oicq")

async function decrease(_bot, data) {
    if (!await getPermission(data, "退群")) return;
    let pic = "https://gchat.qpic.cn/gchatpic_new/1051487481/710085830-2781027618-BD9E2FC0920308CEF30798EC10CDD30C/0?term=3";
    if (typeof data.member === "undefined") return;
    _bot.sendGroupMsg(data.group_id, [
        segment.text(`${data.member.card === '' ? data.member.nickname : data.member.card}被烤肠妞做成了烤肠`),
        segment.image(pic)
    ])

}
exports.decrease = decrease;