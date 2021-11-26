"use strict"
const fs = require("fs");
const path = require("path");
const { getPermission } = require("../lib/permission");
const accountInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../account.json")));
const help = `
-send [反馈内容]：将提出的意见和建议反馈至窝的主人~
`.trim();

//-send留言功能
async function send(_bot, data, args) {
    if (!await getPermission(data, "send")) return;

    if (args?.length === 1 && ["help", "帮助", ""].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        console.log("Warning！参数长度不应该为0");
        return;
    }
    const where = data.group_name;
    const who = data.sender.nickname;
    _bot.sendPrivateMsg(accountInfo.owner, `[${where}(${data.group_id})][${who}(${data.user_id})]:\n${args.join(" ")}`);
    data.reply(`已经反馈给我的主人咯~`);
}
exports.send = send;