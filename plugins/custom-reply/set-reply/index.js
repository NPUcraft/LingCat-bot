console.log('plugin-custom-reply loaded');

import _ from "lodash";
import download from "download";
import { loadConfigAsJson, writeConfigSync, loadFileAsJson } from "../../../lib/file-system.js";
import { getPermission } from "../../../lib/permission.js";
import dirname from "../../../lib/dirname.js";
import { segment } from "oicq";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        let replyDoc = loadConfigAsJson("custom-reply.json");
        if (replyDoc == null) { // 不存在则创建并初始化
            replyDoc = {};
            writeConfigSync("custom-reply.json", JSON.stringify(replyDoc, null, '\t'), true);
        };
        help = `
<#set '定义' = '内容'>
+ 支持图片和at成员的定义
+ [定义]与[内容]只能用半角单引号'引用
+ [定义]默认忽略首尾多余的空格

<#set -r '定义'> 删除该定义词
<#set -i '定义'> 查看该定义词相关信息
            `.trim();
    });

    hook('onMessage', async function (e) {
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
            } else if (arg == "r") {
                e.data.reply(removeStatus(e.data));
                subCmd = true;
                break;
            } else if (arg == "i") {
                e.data.reply(showInfo(e.data));
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(await customReply(e.data, e.cmd));
        }
    });
}

async function customReply(data, cmd) {
    const gid = String(data.group_id);
    let replyInfo = parseDefinition(data.message, cmd.length);
    if (typeof replyInfo === "string") return replyInfo;
    let replyDoc = loadConfigAsJson("custom-reply.json");
    if (replyDoc[gid] == void 0) replyDoc[gid] = { "SUPERUSER": [], "reply": [] };

    let addIndex = -1;
    for (let cnt = 0; cnt < replyDoc[gid]["reply"].length; cnt++) {
        const addedReplyInfo = replyDoc[gid]["reply"][cnt];
        if (addedReplyInfo["abstract"].trim().toLowerCase() == replyInfo.abstract.toLowerCase())
            addIndex = cnt;
    }
    if (addIndex == -1) {    // 添加成功
        replyDoc[gid]["reply"].push({
            "time": data.time,
            "who": data.user_id,
            "abstract": replyInfo.abstract,
            "key": replyInfo.key,
            "words": replyInfo.words
        });
        writeConfigSync("custom-reply.json", JSON.stringify(replyDoc, null, '\t'), true);
        await saveImg(replyInfo.key, replyInfo.words, gid);
        return "添加成功";
    } else {
        return "[ERROR] 添加失败！关键词已存在,请删除后重新添加";
    }
}

async function saveImg(key, words, guid) {
    for (let k = 0; k < key.length; k++) {
        if (key[k].type == "image") {
            await download(key[k].url, `data/config/custom-reply-dist/${guid}`, { "filename": key[k].file });
        }
    }
    for (let w = 0; w < words.length; w++) {
        if (words[w].type == "image") {
            await download(words[w].url, `data/config/custom-reply-dist/${guid}`, { "filename": words[w].file });
        }
    }
}

function removeStatus(data) {
    let key = data.message;
    let startQ = key[0]["text"].indexOf("'");
    if (startQ == -1) return "[ERROR] 关键词请用'引用";
    key[0]["text"] = key[0]["text"].slice(startQ + 1);
    if (!(key[key.length - 1]["type"] == "text" && key[key.length - 1]["text"].endsWith("'")))
        return "[ERROR] 关键词请用'引用";
    key[key.length - 1]["text"] = key[key.length - 1]["text"].slice(0, key[key.length - 1]["text"].length - 1);
    key = buildMsgAbstract(key).trim();

    const gid = String(data.group_id);
    let replyDoc = loadConfigAsJson("custom-reply.json");
    if (replyDoc[gid] == void 0) replyDoc[gid] = { "SUPERUSER": [], "reply": [] };


    let delIndex = -1;
    for (let cnt = 0; cnt < replyDoc[gid]["reply"].length; cnt++) {
        const replyInfo = replyDoc[gid]["reply"][cnt];
        if (replyInfo["abstract"].trim().toLowerCase() == key.toLowerCase())
            delIndex = cnt;
    }
    if (delIndex == -1)  // 删除失败
        return "[ERROR] 删除失败！关键词不存在";
    else {
        replyDoc[gid]["reply"].splice(delIndex, 1);
        writeConfigSync("custom-reply.json", JSON.stringify(replyDoc, null, '\t'), true);
        return "删除成功!";
    }
}

function showInfo(data) {
    let key = data.message;
    let startQ = key[0]["text"].indexOf("'");
    if (startQ == -1) return "[ERROR] 关键词请用'引用";
    key[0]["text"] = key[0]["text"].slice(startQ + 1);
    if (!(key[key.length - 1]["type"] == "text" && key[key.length - 1]["text"].endsWith("'")))
        return "[ERROR] 关键词请用'引用";
    key[key.length - 1]["text"] = key[key.length - 1]["text"].slice(0, key[key.length - 1]["text"].length - 1);
    key = buildMsgAbstract(key).trim();

    const gid = String(data.group_id);
    let replyDoc = loadConfigAsJson("custom-reply.json");
    if (replyDoc[gid] == void 0) replyDoc[gid] = { "SUPERUSER": [], "reply": [] };

    for (const replyInfo of replyDoc[gid]["reply"]) {
        if (replyInfo.abstract.trim().toLocaleLowerCase() == key.toLocaleLowerCase())
            return [
                `定义者：`,
                segment.at(replyInfo.who),
                `\n定义时间：${new Date(replyInfo.time * 1000).toLocaleString()}`
            ];
    }
    return "";
}
/*
 * 
 * set 自定义回复流程
 * 
 * 接收到message后进行解析，格式符合后返回key，words，abstract等相关信息储存
 * 
 * 触发群消息事件则将消息提取摘要，与数据库中的abstract对比，对比方式为不敏感大小写，
 * 未来加入忽略字符对比，对比成功则返回words发送
 * 
 * 字典显示则分类显示
 */


// 构建消息摘要用于比对消息是否相同
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

function parseDefinition(message, cmdLength) {
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

    // 查找第一个出现的 ' = ' 位置, 忽略其间的空格
    let endIndex = -1, startIndex = -1, msgIndex = -1;
    for (let msgCnt = 0; msgCnt < message.length; msgCnt++) {
        if (startIndex !== -1) break;
        const m = message[msgCnt];

        if (m.type !== "text") continue;
        for (let cnt = 0; cnt < m.text.length; cnt++) {
            let next = -1, nnext = -1;
            if (cnt <= (m.text.length - 1 - 2)) // 如果第一个字符后还有两个可以判断的字符
                next = nextChar(m.text, cnt);
            if (next !== -1)
                nnext = nextChar(m.text, next);
            if (nnext !== -1) {
                if (m.text[cnt] == "'" && m.text[nnext] == "'" && ["=", "＝"].indexOf(m.text[next]) !== -1) {
                    startIndex = cnt;
                    endIndex = nnext;
                    msgIndex = msgCnt;
                    break;
                }
            }
        }
    }
    if (startIndex === -1) return "[ERROR] 检查定义与内容之间需要用=连接";
    // 返回key,words与abstract
    let key = [], words = [];
    for (let cnt = 0; cnt < msgIndex; cnt++) {
        key.push(message[cnt]);
    }
    key.push({ type: "text", text: message[msgIndex]["text"].slice(0, startIndex).trimEnd() });

    words.push({ type: "text", text: message[msgIndex]["text"].slice(endIndex + 1) });
    for (let cnt = msgIndex + 1; cnt < message.length; cnt++) {
        words.push(message[cnt]);
    }
    // 构建消息摘要【image->file,at->qq】
    let abstract = buildMsgAbstract(key);
    if (abstract.trim() == "") return "[ERROR] 未知的关键词！"
    return { key: key, words: words, abstract: abstract };
}

// 查找下一个不为空字符的位置
function nextChar(string, index) {
    if (index >= string.length || index < 0) return -1;
    for (let cnt = index + 1; cnt < string.length; cnt++)
        if (string[cnt].trim() !== "")
            return cnt;
    return -1;
}

export { apply };