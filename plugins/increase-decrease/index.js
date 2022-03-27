console.log('plugin-increase-decrease loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { Data } from "./Data.js";
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
<#welcome '欢迎词'> 定制入群欢迎词
+ @新人请使用该符号：<at>
+ 仅能使用一次@
+ 欢迎词需要用'引用
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
            e.data.reply(setWelcomeMsg(e.data, e.cmd.length));
        }
    });

    hook('onNotice', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname)) return;
        if (e.data.sub_type === "decrease") e.bot.sendGroupMsg(e.data.group_id, decreaseGroup(e.data));
        if (e.data.sub_type === "increase") e.bot.sendGroupMsg(e.data.group_id, increaseGroup(e.bot, e.data));
    });
}

function setWelcomeMsg(data, cmdLength) {
    let message = data.message;
    if (buildMsgAbstract(message).split("<at>").length > 2) return "[ERROR] @新人太多次了！";

    // 处理掉命令头
    // 根据cmdLength去除message中的命令
    message[0]["text"] = message[0]["text"].slice(cmdLength + 1);
    // 处理首位空字符判断是否'开头并结尾
    message[0]["text"] = message[0]["text"].trimStart();
    if (!message[0]["text"].startsWith("'")) return "[ERROR] 检查定义内容需要用'引用";
    let msgLen = message.length;
    if (message[msgLen - 1]["type"] !== "text") return "[ERROR] 检查定义内容需要用'引用";
    message[msgLen - 1]["text"] = message[msgLen - 1]["text"].trimEnd();
    if (!message[msgLen - 1]["text"].endsWith("'")) return "[ERROR] 检查定义内容需要用'引用";

    // 删除前后标识符'并处理key首的空白字符
    message[0]["text"] = message[0]["text"].slice(1).trimStart();
    let endMsg = message[msgLen - 1]["text"];
    message[msgLen - 1]["text"] = endMsg.slice(0, endMsg.length - 1);

    new Data().updateWelcome(data.group_id, message);
    return "设置成功";
}

function increaseGroup(bot, data) {
    let welcome = new Data().getWelcome(data.group_id, data.user_id); // 自定义欢迎词
    if (welcome == void 0) {    // 没有自定义则使用默认
        let groupInfo = bot.gl.get(data.group_id);
        const gname = groupInfo?.["group_name"];
        let pics = 'https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2873382820-23B9EFE00CC09375E32B079DA5288683/0?term=2';
        welcome = ["欢迎", data.nickname, `加入${gname}！`, segment.image(pics)];
    }
    return welcome;
}

function decreaseGroup(data) {
    let pic = "https://gchat.qpic.cn/gchatpic_new/1051487481/710085830-2781027618-BD9E2FC0920308CEF30798EC10CDD30C/0?term=3";
    if (data.member == void 0) data.member = { "card": "一位无名氏" };
    return [
        `${data.member.card === '' ? data.member.nickname : data.member.card}被烤肠妞做成了烤肠`,
        segment.image(pic)
    ];
}

function buildMsgAbstract(message) {
    let abstract = [];
    message.forEach(m => {
        if (m.type === 'text') {
            abstract.push(m?.text);
        } else if (m.type === 'face') {
            abstract.push(`face${m?.id}`);
        } else if (m.type === 'image') {
            abstract.push(`image${m?.file}`);
        } else if (m.type === 'at') {
            abstract.push(`at${m?.qq}`);
        } else {
        }
    })
    return abstract.join("");
}

export { apply };