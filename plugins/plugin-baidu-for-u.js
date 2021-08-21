"use strict"
const { bot } = require("../index");
const { segment } = require("oicq")
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;
const database = databaseInfo.database;
const collection = databaseInfo.collection;
const { getPermission } = require("../lib/permission");
const https = require("https");

const help = `
[为你百度 帮助]
使用命令<-百度 要百度的内容>帮你百度一下~
`.trim();
async function baiduForU(data, args) {
    if (!await getPermission(data, "baiduForU")) return;
    if (args.length === 0) {
        data.reply(help);
    } else {
        data.reply([segment.share(`https://lmbtfy.cn/?q=${args.join(" ")}`, `${args.join(" ")}`,
            "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
            `让我来为你百度`)]);
    }
}

module.exports = baiduForU;