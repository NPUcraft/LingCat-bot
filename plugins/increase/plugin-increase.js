"use strict"
const { getPermission } = require("../../lib/permission");
const { Data } = require("./Data");
const fs = require("fs");
const path = require("path");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json")));
const help = `
自定义入群欢迎词
@新人请使用该符号：<at>
`.trim();

//监听群员入群事件
async function increase(_bot, data) {
    if (!await getPermission(data, "入群欢迎")) return;
    let welcome = new Data().getWelcome(data.group_id, data.user_id); // 自定义欢迎词
    if (welcome == void 0) {    // 没有自定义则使用默认
        let groupInfo = _bot.gl.get(data.group_id);
        const gname = groupInfo?.["group_name"];
        let pics = '[CQ:image,file=23b9efe00cc09375e32b079da528868353102-200-200.gif,url=https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2873382820-23B9EFE00CC09375E32B079DA5288683/0?term=2]'
        welcome = "欢迎" + data.nickname + `加入${gname}！` + pics;
    }
    _bot.sendGroupMsg(data.group_id, welcome);
}
exports.increase = increase;

async function setWelcomeMsg(_bot, data, args) {
    if (!await getPermission(data, "入群欢迎")) return;
    if (!(Number(botInfo["owner"]) == data.user_id
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {
        data.reply(`权限不足`);
        return;
    }
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        return;
    }
    new Data().updateWelcome(data.group_id, args[0]);
    data.reply("设置成功");
}
exports.setWelcomeMsg = setWelcomeMsg;