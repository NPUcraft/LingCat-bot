"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const { getPermission } = require("../lib/permission");
const permissionDir = path.join(__dirname, "../config-template/config");
const permissionPath = permissionDir + "/permission.json";
const help = `
<#开启 [插件命令名]>: 开启该插件功能
<#关闭 [插件命令名]>: 关闭该插件功能
`.trim();

/**
 * 打开插件
 * @param {*} data 
 * @param {*} args 插件名
 */
async function turnOn(_bot, data, args) {
    if (!await getPermission(data, "turnOn")) return;
    if (args.length === 0) {
        data.reply(help);
    } else if (args.length === 1) {
        let name = "_" + args[0];
        const gid = String(data.group_id);
        let permission = _readFileSync(permissionDir, "permission");
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
async function turnOff(_bot, data, args) {
    if (!await getPermission(data, "turnOff")) return;
    if (args.length === 0) {
        data.reply(help);
    } else if (args.length === 1) {
        let name = "_" + args[0];
        const gid = String(data.group_id);
        let permission = _readFileSync(permissionDir, "permission");
        permission[gid][name]["activation"] = false;
        fs.writeFileSync(permissionPath, JSON.stringify(permission, null, '\t'));
        data.reply(`已关闭${name}`);
    } else {
        data.reply("参数太多！");
    }
}

exports.turnOn = turnOn;
exports.turnOff = turnOff;