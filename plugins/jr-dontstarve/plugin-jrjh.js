"use strict"
const { bot } = require("../../index");
const fs = require("fs");
const { segment } = require("oicq");
const http = require('http');
const cheerio = require("cheerio");
const seedRandom = require("../../lib/seed-random");
const path = require("path");

bot.on("message.group.normal", async function (e) {
    if (e.raw_message === "-今日菜品") {
        let dontStarveFoodList = await getDontStarveFoodList(); // 创建一个数组，用来保存资源
        const seedID = e.sender.user_id + new Date().toLocaleDateString();
        let foodItem = dontStarveFoodList[
            seedRandom.getRandomInt(seedID, 0, dontStarveFoodList.length)
        ];
        e.reply([
            segment.text(`${e.sender.nickname}，今天的菜品是${foodItem.name}`),
            segment.image(foodItem.image),
            segment.text(`HP:${foodItem.HP}，HV:${foodItem.HV}，SAN:${foodItem.SAN}`)
        ]);
    }
});

bot.on("message.group.normal", (e) => {
    if (e.raw_message === "-更新菜谱") {
        try {
            updateDontStarveFoodList();
            e.reply("菜谱已更新");
        } catch (error) {
            e.reply("更新失败")
        }
    }
});

async function getDontStarveFoodList() {
    let content;
    try {
        content = fs.readFileSync(path.join(__dirname, './foodlist.json'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            await updateDontStarveFoodList();
            content = fs.readFileSync(path.join(__dirname, './foodlist.json'));
        }
    }
    return JSON.parse(content);
}

function updateDontStarveFoodList() {
    const url = 'http://dontstarve.fandom.com/zh/wiki/%E9%A3%9F%E7%89%A9';
    let dontStarveFoodList = [] // 创建一个数组，用来保存资源
    http.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            let $ = cheerio.load(html);
            let foodTable = $('tr', '.wikitable.sortable');

            foodTable.each(function (item, index) {  //遍历html文档
                if (item > 0) {
                    let foodObj = $(this).children('td');
                    dontStarveFoodList.push({
                        name: foodObj.eq(1).children('a').text(),
                        image: foodObj.eq(0).find('img').attr('data-src'),
                        HP: foodObj.eq(3).text(),
                        HV: foodObj.eq(4).text(),
                        SAN: foodObj.eq(5).text(),
                    });
                }

            })
            fs.writeFileSync(
                path.join(__dirname, './foodlist.json'), JSON.stringify(dontStarveFoodList)
            );
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}