"use strict"
const { bot } = require("../index");

async function followRecall(data) {
    console.log(data);
    bot.deleteMsg(data.message_id);
}
module.exports = followRecall;