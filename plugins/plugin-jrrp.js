"use strict"
const seedRandom = require("../lib/seed-random");
const { getPermission } = require("../lib/permission");
//jrrp功能
async function jrrp(data) {
    if (!await getPermission(data, "jrrp")) return;
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    const randomnum = seedRandom.getRandomIntInclusive(seedID, -20, 120)
    let card = data.sender.card;
    data.reply(`${card === '' ? data.sender.nickname : card} 今日的人品为 ${randomnum}`)
}
exports.jrrp = jrrp;
