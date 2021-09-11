"use strict"
// const { bot } = require("../../index");
const fs = require("fs");
const { segment } = require("oicq");
const https = require('https');
const cheerio = require("cheerio");
const path = require("path");
const { getPermission } = require("../lib/permission");

async function jrmchl(data, args = null) {
    if (!await getPermission(data, "getMcAlmanac")) return;
    let time = new Date().toLocaleDateString();
    await getMcAlmanac(e => {
        let goods = [];
        let bads = [];
        e[0].forEach(element => {
            goods.push(`☆${element.title}: ${element.text}`)
        });
        e[1].forEach(element => {
            bads.push(`☒ ${element.title}: ${element.text}`)
        });

        let msg = `今日运势（${time}）\n宜：\n` + goods.join("\n") + `\n\n忌：\n` + bads.join("\n");
        data.reply(msg);
    })
}
exports.jrmchl = jrmchl;

function getMcAlmanac(callback) {
    const url = 'https://www.mcmod.cn/tools/almanacs/';
    let goodList = [];
    let badList = [];
    https.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            let $ = cheerio.load(html);
            let good = $('.good').find($('.block'));
            good.each(function (item, index) {  //遍历html文档
                let content = $(this);
                goodList.push({
                    title: content.find('.title').text(),
                    text: content.find('.text').text(),
                })
            })
            let bad = $('.bad').find($('.block'));
            bad.each(function (item, index) {  //遍历html文档
                let content = $(this);
                badList.push({
                    title: content.find('.title').text(),
                    text: content.find('.text').text(),
                })
            })
            callback([goodList, badList]);
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}