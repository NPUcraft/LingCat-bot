"use strict"
const { bot } = require("../../index");
const fs = require("fs");
const { segment } = require("oicq");
const http = require('http');
const cheerio = require("cheerio");
const seedRandom = require("../../lib/seed-random");
const path = require("path");
const { getPermission } = require("../../lib/permission");

async function jrjh(data, args) {
    if (!await getPermission(data, "今日菜品")) return;
    if (args.length === 0) {
        let dontStarveFoodList = await getDontStarveFoodList(); // 创建一个数组，用来保存资源
        const seedID = data.sender.user_id + new Date().toLocaleDateString();
        let foodItem = dontStarveFoodList[
            seedRandom.getRandomInt(seedID, 0, dontStarveFoodList.length)
        ];
        data.reply([
            segment.text(`${data.sender.nickname}，今天的菜品是${foodItem.name}`),
            segment.image(foodItem.image),
            segment.text(`HP:${foodItem.HP}，HV:${foodItem.HV}，SAN:${foodItem.SAN}`)
        ]);
    } else if (args.length === 1) {
        if (args[0] === "更新") {
            if (data.sender.role === "member") { data.reply("权限不足"); return; };
            try {
                updateDontStarveFoodList();
                data.reply("菜谱已更新");
            } catch (error) {
                data.reply("更新失败")
            }
        }
    }
}
exports.jrjh = jrjh;

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