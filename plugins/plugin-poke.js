"use strict"
const fs = require("fs");
// const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
const { getPermission } = require("../lib/permission");
const words = [
    `既然你诚心诚意在戳我，那就大发慈悲地告诉你：没有涩图！`,
    `你用左手戳的还是右手戳的？`,
    `我错了我错了，别戳了`,
    `戳够了吗？该学习了`,
    `你再戳，我就让你来给我写插件`,
    `别戳了别戳了`,
    `再戳窝以后就不给你私聊发涩图了`,
    `嗷呜~`
]
/**
 * 戳一戳
 */
async function poke(_bot, data) {
    if (!await getPermission(data, "戳一戳")) return;
    if (data.target_id === data.self_id) {
        _bot.sendGroupMsg(data.group_id, words[Math.floor(Math.random() * words.length)]);
    }
}

exports.poke = poke;