"use strict"
const { bot } = require("../index");

/**
 * at事件
 */
bot.on("message.group.normal", (data) => {
    let tag = data.message[0].data.qq;
    if (tag == 1330615670) {
        data.reply("喵~找窝干嘛？" + "[CQ:face,id=306,text=/牛气冲天]");
    }
});