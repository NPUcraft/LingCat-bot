"use strict"
const { bot } = require("../index");

/**
 * at事件
 */
bot.on("message.group.normal", (data) => {
    let tag = data.raw_message;
    var n = tag.startsWith("[CQ:at,qq=3636520140")
    if (n == true) {
        var record = "喵~找窝干嘛？" + "[CQ:face,id=306,text=/牛气冲天]"
        bot.sendGroupMsg(data.group_id, record)
    }
});