"use strict"
// const { bot } = require("../index");
const mongodbUtils = require("../lib/mongodb");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;
const database = databaseInfo.database;
const replyColl = databaseInfo.replyCollection;
const { getPermission } = require("../lib/permission");

async function setReply(data, key, value) {
    if (!await getPermission(data, "自定义回复")) return;
    if (data.sender.role === "member") {
        data.reply(`权限不足`);
        return;
    }
    let replyObj = await mongodbUtils.getData(database, replyColl,
        { "group_id": data.group_id }, "reply");
    replyObj[key] = value;
    await mongodbUtils.findAndUpdateDocument(database, replyColl, { "group_id": data.group_id }, {
        "reply": replyObj
    })
    data.reply("添加成功");
}
exports.setReply = setReply;

async function deleteReply(data, args) {
    if (!await getPermission(data, "自定义回复")) return;
    if (data.sender.role === "member") {
        data.reply(`权限不足`);
        return;
    }
    let replyObj = await mongodbUtils.getData(database, replyColl,
        { "group_id": data.group_id }, "reply");
    args.forEach(elem => {
        delete replyObj[elem];
    });
    await mongodbUtils.findAndUpdateDocument(database, replyColl, { "group_id": data.group_id }, {
        "reply": replyObj
    })
    data.reply("删除成功");
}
exports.deleteReply = deleteReply;

async function customReply(data, args) {
    if (!await getPermission(data, "自定义回复")) return;
    let replyObj = await mongodbUtils.getData(database, replyColl,
        { "group_id": data.group_id }, "reply");
    data.reply(replyObj?.[args]);
}
exports.customReply = customReply;