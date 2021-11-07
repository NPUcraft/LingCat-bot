"use strict"
const { getPermission } = require("../lib/permission");
const axios = require('axios');
const help = `
搜索二刺猿图片并返回其信息
`.trim();

async function findPic(_bot, data, args = null) {
    if (!await getPermission(data, "搜图")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        return;
    }
    let url = Array.from(args[0].matchAll(/url=(.*?)]/g))?.[0]?.[1];
    let info = await findPicHandler(url);
    if (typeof info === "undefined") return;
    data.reply(info);
}
exports.findPic = findPic;

async function getPicInfo(url) {
    const data = await axios.get('https://saucenao.com/search.php', {
        params: {
            url: url,
            db: 999,
            api_key: `ad88a59504b2608ebb0557f3a2a566e588637e94`,
            output_type: 2,
            numres: 3
        }
    })
    return data?.data;
}

async function findPicHandler(url) {
    let result = await getPicInfo(url);
    if (typeof result === "undefined") return;
    if (result["header"]["status"] != 0) return;
    if (result["header"]["results_returned"] <= 0) return "Not Found!";
    if (result["results"][0]["header"]["similarity"] < result["header"]["minimum_similarity"]) return "Not Found!!";
    return JSON.stringify(result["results"][0], null, "\t");
}