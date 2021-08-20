"use strict"
const { bot } = require("../index");
const mongodbUtils = require("../lib/mongodb");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;
const database = databaseInfo.database;
const collection = databaseInfo.collection;
const { getPermission } = require("../lib/permission");


/**
 * 打开插件
 * @param {*} data 
 * @param {*} args 插件名
 */
async function turnOn(data, args) {
    if (!await getPermission(data, "turnOn")) return;
    if (args.length === 0) {
    } else if (args.length === 1) {
        let name = "_" + args[0];
        let filter = { "group_id": data.group_id };
        filter[(name + ".exists")] = true;
        let document = {};
        document[(name + ".activation")] = true;
        mongodbUtils.findAndUpdateDocument(database, collection, filter, document)
            .then(
                res => { if (res.value !== null) data.reply(`已开启${name}`) },
                err => { data.reply(`发生错误:${err.message}`) }
            );
    } else {
        data.reply("参数太多！");
    }
}

/**
 * 关闭插件
 * @param {*} data 
 * @param {*} args 插件名
 */
async function turnOff(data, args) {
    if (!await getPermission(data, "turnOff")) return;
    if (args.length === 0) {
    } else if (args.length === 1) {
        let name = "_" + args[0];
        let filter = { "group_id": data.group_id };
        filter[(name + ".exists")] = true;
        let document = {};
        document[(name + ".activation")] = false;
        mongodbUtils.findAndUpdateDocument(database, collection, filter, document)
            .then(
                res => { if (res.value !== null) data.reply(`已关闭${name}`) },
                err => { data.reply(`发生错误:${err.message}`) }
            );
    } else {
        data.reply("参数太多！");
    }
}

exports.turnOn = turnOn;
exports.turnOff = turnOff;