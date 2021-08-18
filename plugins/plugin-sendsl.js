"use strict"
const { bot } = require("../index");

//-sendsl留言功能
bot.on("message.group.normal", (data) => {
    let tag = data.raw_message;
    var compair = tag.split(" ")[0];
    var send = tag.split(" ")[1];
    if (compair == "-sendsl") {
        var where = data.group_name;
        var who = data.sender.card;
        if (data.sender.card == '') {
            who = data.sender.nickname;
        };
        bot.sendPrivateMsg(1051487481, "[" + where + "]" + "[" + who + "]" + send);
    }
});