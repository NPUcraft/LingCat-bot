"use strict"
const { getPermission } = require("../lib/permission");

/**
 * 戳一戳
 */
async function poke(_bot, data) {
    if (!await getPermission(data, "戳一戳")) return;
    if (data.target_id === data.self_id) {
        _bot.sendGroupMsg(data.group_id, `嗷呜~`);
    }
}

exports.poke = poke;