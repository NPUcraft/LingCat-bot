"use strict"
const seedRandom = require("../lib/seed-random");
const { getPermission } = require("../lib/permission");
const goodNumber = [666, 888, 188, 648, 288, 600, 800, 999, 1314, 168, 199, 99, 100, 520, 521, 258, 88];
const help = `
查看今日人品
`.trim();

async function jrrp(_bot, data, args = null) {
    if (!await getPermission(data, "jrrp")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    let today = new Date();
    const seedID = data.sender.user_id + today.toLocaleDateString();
    let randomNum = seedRandom.getRandomIntInclusive(seedID, -20, 120);
    let sender = data.sender.card ? data.sender.card : data.sender.nickname;
    randomNum = (today.getTime() > new Date(2022, 0, 30).getTime() && today.getTime() < new Date(2022, 1, 14).getTime()) ? goodNumber[(randomNum % goodNumber.length + goodNumber.length) % goodNumber.length] : randomNum;
    data.reply(`${sender} 今日的人品为 ${randomNum}`);
}
exports.jrrp = jrrp;
