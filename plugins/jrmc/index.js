console.log('plugin-jrmc loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { segment } from "oicq";
import https from "https";
import cheerio from "cheerio";
import seedRandom from "../../lib/seed-random.js";
import Jimp from "jimp";
import { writeFileSync, loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);


let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
查看今日MC物品方块
            `.trim();
    });

    hook('onMessage', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname, [e.flag, e.cmd])) return;
        /* 解析命令 参数未知报错提示 */
        if (typeof e.args === "string") {
            e.data.reply(e.args);
            return;
        }

        /* 根据参数列表实现次级功能 */
        let subCmd = false;
        for (const arg in e.args) {
            if (arg == "h") {
                e.data.reply(help);
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(jrmc(e.data));
        }
    });
}

function jrmc(data) {
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    let blocks = JSON.stringify(loadFileAsJson([__dirname, "blocklist.json"]));
    let items = JSON.stringify(loadFileAsJson([__dirname, "itemlist.json"]));
    let mcList = JSON.parse((blocks + items).replace("][", ','));
    let mcItem = mcList[
        seedRandom.getRandomInt(seedID, 0, mcList.length)
    ];
    let card = data.sender.card;
    let img = typeof mcItem.image == 'string' ? mcItem.image : Buffer.from(mcItem.image);
    return ([
        `${card === '' ? data.sender.nickname : card}，今天的MC是${mcItem.name}`,
        segment.image(img)
    ]);
}

async function updateAll() {
    updateMcBlockList();
    await updateMcItemList();
}

function updateMcBlockList() {
    const url = 'https://minecraft.fandom.com/zh/wiki/%E6%96%B9%E5%9D%97';
    let mcBlockList = [] // 创建一个数组，用来保存资源
    https.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            let $ = cheerio.load(html);
            let mcBlockTable = $('li', '.collapsible-content');
            mcBlockTable.each(function (item, index) {  //遍历html文档
                let blockObj = $(this).children('a');
                mcBlockList.push({
                    name: blockObj.eq(1).text(),
                    image: blockObj.eq(0).find('img').attr('data-src'),
                });
            })
            writeFileSync([__dirname, "blocklist.json"], JSON.stringify(mcBlockList), true);
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

async function updateMcItemList() {
    const url = 'https://minecraft.fandom.com/zh/wiki/%E7%89%A9%E5%93%81';
    let mcItemList = [] // 创建一个数组，用来保存资源
    https.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', async function () {
            let $ = cheerio.load(html);
            let mcItemTable = $('li', '.div-col.columns');
            // console.log(mcItemTable.html())
            mcItemTable.each(function (item, index) {  //遍历html文档
                let itemObj = $(this).children('a').eq(0).find('span').children('span');
                let picInfo = itemObj.eq(0).attr('style');
                const regUrl = /url\((.*?)\)/g;
                const regPos = /(\d*)px/g;
                let picUrl = Array.from(picInfo.matchAll(regUrl))[0];
                let pos = Array.from(picInfo.matchAll(regPos));
                // console.log(pos);
                // let img = await crop(picUrl[1], Number(pos[0][1]), Number(pos[1][1]));
                mcItemList.push({
                    name: itemObj.eq(1).text(),
                    image: [Number(pos[0][1]), Number(pos[1][1])]
                });
            })
            for (let index = 0; index < mcItemList.length; index++) {
                const element = mcItemList[index];
                mcItemList[index].image = await crop(null, element.image[0], element.image[1])
            }
            writeFileSync([__dirname, "itemlist.json"], JSON.stringify(mcItemList), true);
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

// 处理图片
async function crop(picUrl, x, y, w = 16, h = 16, resizeW = 30, resizeH = 30) {
    // 读取图片
    const image = await Jimp.read("https://static.wikia.nocookie.net/minecraft_zh_gamepedia/images/f/f5/ItemCSS.png/revision/latest?cb=20220125150516&amp;format=original");
    image.crop(x, y, w, h);
    image.resize(resizeW, resizeH);
    return image.getBufferAsync("image/png");
}

export { apply };