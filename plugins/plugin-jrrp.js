"use strict"
const seedRandom = require("../lib/seed-random");
const { getPermission } = require("../lib/permission");
const help = `
查看今日人品
`.trim();

//jrrp功能
async function jrrp(_bot, data, args = null) {
    if (!await getPermission(data, "jrrp")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    const randomnum = seedRandom.getRandomIntInclusive(seedID, -20, 120)
    let card = data.sender.card;
    data.reply(`${card === '' ? data.sender.nickname : card} 今日的人品为 ${randomnum}`)
}
exports.jrrp = jrrp;
