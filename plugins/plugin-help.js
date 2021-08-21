"use strict"
const { bot } = require("../index");
const mongodbUtils = require("../lib/mongodb");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;
const botNickname = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).botNickname;
const database = databaseInfo.database;
const collection = databaseInfo.collection;
const { getPermission } = require("../lib/permission");

async function helpList(data, args) {
    let helpObj = await mongodbUtils.getOneDocument(database, collection, { "group_id": "description" })
    let index = 1;

    const header = `
    ===== ${botNickname}功能一览 =====
    `.trim();

    let content = '';
    for (let field in helpObj) {
        if (field === "_id") continue;
        if (typeof helpObj[field] == "object") {
            content += `${index++}. <${helpObj[field].cmd}> ${helpObj[field].desc} ${await getPermission(data, field.slice(1)) ? "" : "(已关闭)"}\n`;
        }
    }
    const end = `有什么建议可以直接通过<-sendsl 消息>联系窝~~`;
    data.reply(`${header}\n${content + end}`);
}
exports.helpList = helpList;