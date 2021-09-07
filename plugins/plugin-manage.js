"use strict"
const mongodbUtils = require("../lib/mongodb");
const fs = require("fs");
const path = require("path");
const { getPermission } = require("../lib/permission");
const permissionPath = path.join(__dirname, "../config/permission.json");

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
        const gid = String(data.group_id);
        let permission = JSON.parse(fs.readFileSync(permissionPath));
        permission[gid][name]["activation"] = true;
        fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
        data.reply(`已开启${name}`);
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
        const gid = String(data.group_id);
        let permission = JSON.parse(fs.readFileSync(permissionPath));
        permission[gid][name]["activation"] = false;
        fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
        data.reply(`已关闭${name}`);
    } else {
        data.reply("参数太多！");
    }
}

exports.turnOn = turnOn;
exports.turnOff = turnOff;