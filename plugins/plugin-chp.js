"use strict"
const { getPermission } = require("../lib/permission");
const axios = require('axios');
const help = `
获取一条彩虹屁~【请勿沉迷】
`.trim();

async function chp(_bot, data, args = null) {
    if (!await getPermission(data, "彩虹屁")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    let msg = await getChp();
    data.reply(msg);
}
exports.chp = chp;

const getChp = async () => {
    try {
        let result = await axios.get('https://api.shadiao.app/chp');
        return result?.data?.data?.text;
    } catch (error) {
        console.error(error)
    }
}