"use strict"
const { bot } = require("../index");

/**
 * 戳一戳
 */

bot.on("notice.group.poke", (data) => {
    if (data.target_id === data.self_id) {
        bot.sendGroupMsg(data.group_id, `嗷呜~`);
    }
})