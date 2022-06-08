import _ from "lodash";
import { segment } from "oicq";
import fs from "fs";
import { loadConfigAsJson } from "../../../lib/file-system.js";
import { getPermission } from "../../../lib/permission.js";
import dirname from "../../../lib/dirname.js";
const __dirname = dirname(import.meta.url);


function apply(hook) {

    hook('onMessage', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname)) return;
        let msg = _reply(e.data);
        if (typeof msg == "string") return;
        e.data.reply(msg);
    });
}

function _reply(data) {
    const gid = String(data.group_id);
    let replyDoc = loadConfigAsJson("custom-reply.json");
    if (replyDoc[gid] === void 0) return "";
    // 将消息提取摘要，与数据库中的abstract对比，对比方式为不敏感大小写，对比成功则返回内容
    let msgAbstract = buildMsgAbstract(data.message).trim();
    for (const replyInfo of replyDoc[gid]["reply"]) {
        if (replyInfo.abstract.trim().toLocaleLowerCase() == msgAbstract.toLocaleLowerCase())
            return buildSendableMsg_(replyInfo.words, gid);
    }
    return "";
}

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

// 构建可发送的消息列表(与buildSendableMsg不一样，更改了图片为本地地址)
function buildSendableMsg_(message, gid) {
    let replyMsg = [];
    message.forEach(m => {
        if (m.type === 'text') {
            replyMsg.push(m?.text);
        } else if (m.type === 'face') {
            replyMsg.push(segment.face(m?.id));
        } else if (m.type === 'image') {
            let imageData = fs.readFileSync(`data/config/custom-reply-dist/${gid}/${m?.file}`);
            replyMsg.push(segment.image(imageData));
        } else if (m.type === 'at') {
            replyMsg.push(segment.at(m?.qq));
        } else {
        }
    });
    return replyMsg;
}

export { apply };