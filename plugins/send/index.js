console.log('plugin-send loaded');

import _ from "lodash";
import { segment } from "oicq";
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
            e.data.reply(sendMsg(e.bot, e.data, e.rawArgs, e.data.message));
        }
    });
}

function sendMsg(bot, data, content, message) {
    if (content.trim().length === 0) return "你好像什么也没说哦";
    const where = data.group_name;
    const who = data.sender.nickname;
    let msg = [`[${where}(${data.group_id})][${who}(${data.user_id})]:\n`];
    msg.push(buildSendableMsg(removeCmd(message)));
    bot.sendPrivateMsg(owner, _.flattenDeep(msg));
    return `已经反馈给我的主人咯~`;
}


function removeCmd(message) {
    const botEnv = loadFileAsJson("data/bot-env.json");
    const cfg = loadFileAsJson([__dirname, "config.json"]);
    const cmdList = cfg.cmd;
    const cmdFlag = (cfg.permission.indexOf("member") === -1) ? botEnv.adminCmdFlag : botEnv.cmdFlag;
    let mesTemp = message[0];
    if (mesTemp.type != "text") return message;
    for (let f = 0; f < cmdFlag.length; ++f) {
        for (let c = 0; c < cmdList.length; ++c) {
            if (mesTemp.text.indexOf(cmdFlag[f] + cmdList[c]) == 0) {
                mesTemp.text = mesTemp.text.slice((cmdFlag[f] + cmdList[c]).length).trimStart();
                break;
            }
        }
    }
    message[0] = mesTemp;
    return message;
}

function buildSendableMsg(message) {
    let replyMsg = [];
    message.forEach(m => {
        if (m.type === 'text') {
            replyMsg.push(m?.text);
        } else if (m.type === 'face') {
            replyMsg.push(segment.face(m?.id));
        } else if (m.type === 'image') {
            replyMsg.push(segment.image(m?.url));
        } else if (m.type === 'at') {
            replyMsg.push(segment.at(m?.qq));
        } else {
        }
    });
    return replyMsg;
}

export { apply };