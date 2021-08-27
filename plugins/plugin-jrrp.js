"use strict"
const seedRandom = require("../lib/seed-random");
const Gaussian = require("../lib/Gaussian-distribution")
//jrrp功能
function jrrp(data) {
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    const pool = Gaussian(60, 1, 100)
    const randomnum = seedRandom.getRandomInt(seedID, 0, pool.length)
    const rpnum = pool[randomnum]
    data.reply(`${data.sender.nickname} 今日的人品为 ${Math.floor(rpnum)}`)
}
module.exports = jrrp;
