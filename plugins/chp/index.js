console.log('plugin-chp loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { GET } from "../../lib/http-utils.js";
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
获取一条彩虹屁~【请勿沉迷】
            `.trim();
    });

    hook('onMessage', async function (e) {
        /* DO IT */
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
            e.data.reply(await getChp());
        }
    });
}


async function getChp() {
    let url = 'https://api.shadiao.app/chp';
    let msg = await GET(url);
    if (msg == null) return "歇歇叭 别沉迷于此了！";
    return msg.data.data.text;
}

export { apply };
