"use strict"
const { bot } = require("../index");

/**
 * 监听私聊并回复
 */
bot.on("message.private", (data) => {
    const user_id = 1051487481;// ARKSealin ID
    if (data.user_id != user_id) {
        data.reply("喵~ 找窝干嘛?")
    };
});