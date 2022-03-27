console.log('plugin-baiduForU loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { segment } from "oicq";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
<-baidu 要百度的内容> 帮你百度一下~
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
            e.data.reply(baidu(e.rawArgs));
        }
    });
}

function baidu(content) {
    if (content.trim().length === 0) return help;
    return [segment.share(`https://lmbtfy.cn/?q=${content.trim()}`, `${content.trim()}`,
        "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
        `让我来为你百度`)];
}

export { apply };