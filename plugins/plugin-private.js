"use strict"
const { bot } = require("../index");

/**
 * 监听私聊并回复
 */
function whatsUp(data) {
    data.reply("喵~ 找窝干嘛?");
}
exports.whatsUp = whatsUp;