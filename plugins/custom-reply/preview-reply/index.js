import _ from "lodash";
import { loadFileAsJson, loadConfigAsJson } from "../../../lib/file-system.js";
import { getPermission } from "../../../lib/permission.js";
import { parseArgs } from "../../../lib/parse-args.js";
import { segment } from "oicq";
import dirname from "../../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
<-调教字典> 查看自定义回复关键词
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
            let msgBox = showReplyDoc(e.data);
            if (msgBox.textKeywords.length === 0) {
                e.data.reply(_.concat([`窝的小本本给你看看：\n[ `], msgBox.otherKeywords, [` ]`]));
            } else {
                e.data.reply(`窝的小本本给你看看：\n[ ${msgBox.textKeywords} ]`);
                if (msgBox.otherKeywords.length !== 0)
                    e.data.reply(_.concat([`还有这些：\n[ `], msgBox.otherKeywords, [` ]`]));
            }
        }
    });
}

function showReplyDoc(data) {
    const gid = String(data.group_id);
    // 纯文字和其他定义分开展示
    let textKeywords = [];
    let otherKeywords = [];
    let replyDoc = loadConfigAsJson("custom-reply.json");
    if (replyDoc[gid] == void 0) replyDoc[gid] = { "SUPERUSER": [], "reply": [] };
    for (const replyInfo of replyDoc[gid]["reply"]) {
        // 判断关键字是否为纯文本
        let pureText = true;
        for (const msg of replyInfo["key"]) {
            if (msg.type !== "text") {
                pureText = false;
                break;
            }
        }
        if (pureText) {
            textKeywords.push(buildSendableMsg(replyInfo["key"]).join(""));
        } else {
            otherKeywords = _.concat(otherKeywords, buildSendableMsg(replyInfo["key"]), [" | "])
        }
    }
    otherKeywords.pop();    // 去掉 |
    return { textKeywords: textKeywords.join(" | "), otherKeywords: otherKeywords };
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