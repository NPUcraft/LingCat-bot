"use strict"
const fs = require("fs");
const path = require("path");
const { getPermission } = require("../lib/permission");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
const help = `
<-send [反馈内容]>：将提出的意见和建议反馈至窝的主人~
`.trim();

//-send留言功能
async function send(_bot, data, args) {
    if (!await getPermission(data, "send")) return;
    if (args.length === 0) {
        data.reply(help);
        return;
    }
    const where = data.group_name;
    const who = data.sender.nickname;
    _bot.sendPrivateMsg(botInfo.owner, `[${where}][${who}(${data.user_id})]:\n${args.join(" ")}`);
    data.reply(`已经反馈给我的主人咯~`);
}
exports.send = send;