"use strict"
const { bot } = require("../index");

//监听群员入群事件
function increase(data) {
    let pics = '[CQ:image,file=23b9efe00cc09375e32b079da528868353102-200-200.gif,url=https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2873382820-23B9EFE00CC09375E32B079DA5288683/0?term=2]'
    data.reply("热烈欢迎" + data.nickname + " 加入NPUcraft!" + pics);
}

module.exports = increase;