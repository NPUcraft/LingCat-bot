console.log('plugin-install-update loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { writeConfigSync, loadFileAsJson } from "../../lib/file-system.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let cfg, botEnv, help, cmdFlag;
function apply(hook) {
    hook('onCreate', function (bot) {
        cfg = loadFileAsJson(`${__dirname}/config.json`);
        botEnv = loadFileAsJson("data/bot-env.json");
        cmdFlag = (cfg.permission.indexOf("member") === -1) ? botEnv.adminCmdFlag : botEnv.cmdFlag;
        help = `
<#bot -i> 为本群安装机器人服务
<#bot -u> 为本群更新到最新的机器人版本
            `.trim();
    });

    hook('onMessage', function (e) {
        if (!(cfg.cmd.indexOf(e.cmd) !== -1 && cmdFlag.indexOf(e.flag) !== -1)) return;
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
            } else if (arg == "i") {
                install(e.data);
                subCmd = true;
                break;
            } else if (arg == "u") {
                update(e.data);
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(help);
        }
    });
}

function install(data) {
    const gid = String(data.group_id);
    const botInfo = loadFileAsJson("data/account.json");
    if (!(cfg.permission.indexOf(data.sender.role) !== -1
        || data.user_id === botInfo.owner)) return; // 仅管理员或拥有者可以安装机器人

    /* 配置权限 */
    let permission = loadFileAsJson("data/config/permission.json");
    if (permission == null) {   // 不存在则创建
        writeConfigSync("permission.json", "{}");
        permission = {};
    };
    let installedGroup = Object.keys(permission);
    if (installedGroup.indexOf(gid) !== -1) { // 已存在退出
        data.reply(`已领养${botInfo.botNickname}咯~`);
        return;
    }

    // 配置该群相关参数
    permission[gid] = {};
    permission[gid]["version"] = loadFileAsJson("package.json").version;
    permission[gid] = _.merge(permission[gid], botEnv.pluginsList);
    writeConfigSync("permission.json", JSON.stringify(permission, null, '\t'), true);

    data.reply(`温柔甜美的${botInfo.botNickname}已被带回家~`);
}

function update(data) {
    const gid = String(data.group_id);
    const botInfo = loadFileAsJson("data/account.json");
    if (!(cfg.permission.indexOf(data.sender.role) !== -1
        || data.user_id === botInfo.owner)) return; // 仅管理员或拥有者可以升级机器人

    let permission = loadFileAsJson("data/config/permission.json");
    if (permission == null) {   // 不存在则创建
        writeConfigSync("permission.json", "{}");
        permission = {};
    };

    if (typeof permission?.[gid] === "undefined") {
        data.reply("未安装！请联系管理员使用 <bot -i> 安装");
        return;
    }

    let latestVer = loadFileAsJson("package.json").version;
    let currentVer = permission[gid]["version"];
    if (latestVer === currentVer) {
        data.reply(`已是最新版本:[V${latestVer}]`);
        return;
    }
    permission[gid]["version"] = latestVer;

    // 更新群权限文件
    const groupPlugin = [];
    for (const key in permission[gid]) {    // 获取当前群插件列表
        if (key == "version") continue;
        groupPlugin.push(key)
    }
    for (const key in botEnv.pluginsList) { // 添加新特性
        if (groupPlugin.indexOf(key) === -1) {
            permission[gid][key] = botEnv.pluginsList[key];
        }
    }
    groupPlugin.forEach(plugin => {         // 删除旧特性
        if (Object.keys(botEnv.pluginsList).indexOf(plugin) === -1) {
            delete permission[gid][plugin];
        }
    });

    writeConfigSync("permission.json", JSON.stringify(permission, null, '\t'), true);
    data.reply(`[V${currentVer} -> V${latestVer}]\n我变得更加温柔咯~`);
}

export { apply };