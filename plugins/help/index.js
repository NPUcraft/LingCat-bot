console.log('plugin-help loaded');


import fs from "fs";
import path from "path";
import _ from "lodash";
import { loadFileAsJson, loadConfigAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help, botNickname;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        botNickname = loadFileAsJson("data/account.json").botNickname;
        help = `
这个命令就是让你看功能列表的啊喂~
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
            e.data.reply(showHelp(e.data, e.flag, e.cmd));
        }
    });
}

function showHelp(data, flag, cmd) {
    const gid = String(data.group_id);
    let permission = loadConfigAsJson("permission.json");
    let doc = permission[gid];
    let index = 1;

    const header = formatString(16, ` ${botNickname}功能一览 `, "=");

    let content = '';
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
                let name;
                if (cfg?.pluginName !== "") name = cfg.pluginName;
                else name = plugin;
                content += `${index++}. <${cfg.usage}> ${cfg.description} ${doc[name] ? "" : "(已关闭)"}\n`;
            }
        }
    }

    const end = `如有疑问可以通过<命令 -h>查询详细帮助，如<-help -h>\n有什么建议可以直接通过<-send 消息>联系窝~~`;
    return `${header}\n${content + end}`;
}

// 格式化字符串
const formatString = (len, str, symbol) => {
    const totalLength = len;
    const strLength = str.length;
    const l = Math.floor((totalLength - strLength) / 2);
    return `${str.padEnd(strLength + l, symbol).padStart(totalLength, symbol)}`
}

export { apply };