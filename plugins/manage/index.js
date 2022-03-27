console.log('plugin-manage loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import fs from "fs";
import path from "path";
import { loadConfigAsJson, loadFileAsJson, writeConfigSync } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
<#on [功能序号/插件名]>: 开启该插件功能
<#off [功能序号/插件名]>: 关闭该插件功能
            `.trim();
    });

    hook('onMessage', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname, [e.flag, e.cmd])) return;
        /* 解析命令 参数未知报错提示 */
        if (typeof e.args === "string") {
            e.data.reply(e.args);
            return;
        }

        /* 根据参数列表实现次级功能 */
        let subCmd = false;
        for (const arg in e.args) {
            if (arg == "h") {
                e.data.reply(help);
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            if (["on", "开启", "开"].indexOf(e.cmd) !== -1) {
                e.data.reply(on(e.data, e.rawArgs));
            } else {
                e.data.reply(off(e.data, e.rawArgs));
            }
        }
    });
}

function on(data, plugin) {
    const gid = String(data.group_id);
    if (plugin.trim().length === 0) return help;
    let zip = getPluginNum();
    if (!Number.isNaN(Number(plugin))) plugin = zip?.[plugin];
    let permission = loadConfigAsJson("permission.json");
    let pluginsList = Object.keys(permission[gid])
    _.pull(pluginsList, "version");      // 去除version字段 剩余为已安装的插件列表

    if (plugin == "plugin-manage") return "我关我自己？拒绝！"
    if (pluginsList.indexOf(plugin) === -1) return "[ERROR] 该功能不存在！";
    permission[gid][plugin] = true;
    writeConfigSync("permission.json", JSON.stringify(permission, null, '\t'), true);
    return `已开启${plugin}`;
}

function off(data, plugin) {
    const gid = String(data.group_id);
    if (plugin.trim().length === 0) return help;
    let zip = getPluginNum();
    if (!Number.isNaN(Number(plugin))) plugin = zip?.[plugin];
    let permission = loadConfigAsJson("permission.json");
    let pluginsList = Object.keys(permission[gid])
    _.pull(pluginsList, "version");      // 去除version字段 剩余为已安装的插件列表

    if (plugin == "plugin-manage") return "我关我自己？拒绝！"
    if (pluginsList.indexOf(plugin) === -1) return "[ERROR] 该功能不存在！";
    permission[gid][plugin] = false;
    writeConfigSync("permission.json", JSON.stringify(permission, null, '\t'), true);
    return `已关闭${plugin}`;
}

// 引用plugin-help插件的编序号方法获得插件编号
function getPluginNum() {
    let num = [];
    let pluginsList = [];
    let index = 1;
    // 读取各插件配置文件
    let plugins = fs.readdirSync(path.resolve('plugins'))
        .filter(p => !p.startsWith("_"));
    for (const plugin of plugins) {
        let pluginCfg = fs.readdirSync(path.resolve(`plugins/${plugin}`))
            .filter(item => /config.json/.test(item));
        if (pluginCfg.length == 0) continue;
        let cfg = loadFileAsJson(`plugins/${plugin}/config.json`);
        if (cfg !== null) {
            if (cfg.showThisFeature) {
                num.push(`${index++}`);
                // 获得插件名字
                if (cfg?.pluginName !== "") pluginsList.push(cfg.pluginName)
                else pluginsList.push(plugin);
            }
        }
    }
    return _.zipObject(num, pluginsList);
}

export { apply };