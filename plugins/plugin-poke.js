"use strict"
const { bot } = require("../index");
const { getPermission } = require("../lib/permission");

/**
 * 戳一戳
 */
async function poke(data) {
    if (!await getPermission(data, "戳一戳")) return;
    if (data.target_id === data.self_id) {
        bot.sendGroupMsg(data.group_id, `嗷呜~`);
    }
}

exports.poke = poke;