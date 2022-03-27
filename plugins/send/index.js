console.log('plugin-send loaded');

import _ from "lodash";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help, owner;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        owner = loadFileAsJson("data/account.json").owner;
        help = `
-send [反馈内容]：将提出的意见和建议反馈至窝的主人~
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
            e.data.reply(sendMsg(e.bot, e.data, e.rawArgs));
        }
    });
}

function sendMsg(bot, data, content) {
    if (content.trim().length === 0) return "无字天书我看不懂哎";
    const where = data.group_name;
    const who = data.sender.nickname;
    bot.sendPrivateMsg(owner, `[${where}(${data.group_id})][${who}(${data.user_id})]:\n${content}`);
    return `已经反馈给我的主人咯~`;
}

export { apply };