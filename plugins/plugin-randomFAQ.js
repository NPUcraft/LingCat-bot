"use strict"
const seedRandom = require("../lib/seed-random");
const { getPermission } = require("../lib/permission");
const { _readFileSync } = require("../lib/file");
const path = require("path");
const templateReplyDir = path.join(__dirname, "../config-template");
const help = `
查看一个随机问答
`.trim();

async function randomFAQ(_bot, data, args = null) {
    if (!await getPermission(data, "randomFAQ")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    
    let defalutReplyData = _readFileSync(templateReplyDir, "customRegReply-default");
    let dafaultReplyObj = defalutReplyData["default"]["reply"];

    const seedID = new Date().getTime().toString();
    const randomNum = seedRandom.getRandomInt(seedID, 0, Object.getOwnPropertyNames(dafaultReplyObj).length);
    data.reply(dafaultReplyObj[Object.getOwnPropertyNames(dafaultReplyObj)[randomNum]]);
}
exports.randomFAQ = randomFAQ;
