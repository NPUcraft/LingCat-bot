"use strict"
const fs = require("fs");
const { segment } = require("oicq");
const https = require('https');
const cheerio = require("cheerio");
const seedRandom = require("../../lib/seed-random");
const path = require("path");
const { getPermission } = require("../../lib/permission");
const Jimp = require('jimp')
const help = `
查看今日MC物品方块
`.trim();

async function jrmc(_bot, data, args = null) {
    if (!await getPermission(data, "jrmc")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 1 && args?.[0] === "更新") {
        if (data.sender.role === "member") { data.reply("权限不足"); return; };
        try {
            updateAll();
            data.reply("MC物品已更新");
        } catch (error) {
            data.reply("更新失败")
        }
    } else if (args?.length > 1) {
        return;
    }
    let mcList = await getMcList(); // 创建一个数组，用来保存资源
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    let mcItem = mcList[
        seedRandom.getRandomInt(seedID, 0, mcList.length)
    ];
    let card = data.sender.card;
    let img = typeof mcItem.image == 'string' ? mcItem.image : Buffer.from(mcItem.image);
    data.reply([
        segment.text(`${card === '' ? data.sender.nickname : card}，今天的MC是${mcItem.name}`),
        segment.image(img)
    ]);
}
exports.jrmc = jrmc;

async function getMcList() {
    let content;
    try {
        let blocks = String(fs.readFileSync(path.join(__dirname, './blocklist.json')));
        let items = String(fs.readFileSync(path.join(__dirname, './itemlist.json')));
        content = JSON.parse((blocks + items).replace("][", ','));
    } catch (error) {
        if (error.code === 'ENOENT') {
            await updateAll();
            let blocks = String(fs.readFileSync(path.join(__dirname, './blocklist.json')));
            let items = String(fs.readFileSync(path.join(__dirname, './itemlist.json')));
            content = JSON.parse((blocks + items).replace("][", ','));
        }
    }
    return content;
}

function updateMcBlockList() {
    const url = 'https://wiki.biligame.com/mc/%E6%96%B9%E5%9D%97';
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
                    image: blockObj.eq(0).find('img').attr('src'),
                });
            })
            fs.writeFileSync(
                path.join(__dirname, './blocklist.json'), JSON.stringify(mcBlockList)
            );
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

async function updateMcItemList() {
    const url = 'https://wiki.biligame.com/mc/%E7%89%A9%E5%93%81';
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
            fs.writeFileSync(
                path.join(__dirname, './itemlist.json'), JSON.stringify(mcItemList)
            );
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

async function updateAll() {
    await updateMcBlockList();
    await updateMcItemList();
}

// 处理图片
async function crop(picUrl, x, y, w = 16, h = 16, resizeW = 30, resizeH = 30) {
    // 读取图片
    const image = await Jimp.read("https://patchwiki.biligame.com/images/mc/f/f5/31w7flrslhyg1m65ns8llipg8m4ox90.png?format=original");
    image.crop(x, y, w, h);
    image.resize(resizeW, resizeH);
    return image.getBufferAsync("image/png");
}