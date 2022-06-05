console.log('plugin-repeater loaded');

import _ from "lodash";
import { segment } from "oicq";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
const botEnv = loadFileAsJson("data/bot-env.json");

// 消息列表
const msgList = {
    "groupID": []
};
// (打破)复读参数
const startRepeat = 3;      // 从第三条开始复读
const probability = 0.6;  // 事件触发概率

function apply(hook) {

    hook('onMessage', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname)) return;

        // 概率触发该功能
        if (Math.random() > probability) return;
        const gid = String(e.data.group_id);
        // 初始化当前群的消息列表
        if (msgList[gid] == void 0) msgList[gid] = [];
        let msgAbstract = buildMsgAbstract(e.data.message) + `✈${e.data.user_id}`;

        // 命令不计入复读表中
        if (_.union(botEnv.cmdFlag, botEnv.adminCmdFlag).indexOf(msgAbstract[0]) !== -1) return;

        // 判断消息一致且连续两个人不是同一个人则压入消息列表,不一致则重置
        if (findSubstrBeforeSym(msgAbstract, "✈") == findSubstrBeforeSym(msgList[gid][msgList[gid].length - 1], "✈")) {
            if (msgList[gid][msgList[gid].length - 1] !== msgAbstract)
                msgList[gid].push(msgAbstract);
        } else {
            msgList[gid] = [];
            msgList[gid][0] = msgAbstract;
        }
        // 达到响应条数后响应事件 并等待复读结束再清空消息列表
        if (msgList[gid].length == startRepeat) {
            if (Math.random() < 0.75) {  // 复读
                e.data.reply(repeat(e.data));
            } else {  // 打破复读
                e.data.reply(_break());
                msgList[gid] = [];
            }
        }
    });
}

function repeat(data) {
    return buildSendableMsg(data.message);
}

// 概率发送图片打破复读
function _break() {
    const imgs = [
        "https://c2cpicdw.qpic.cn/offpic_new/1694605269//1694605269-2731383275-951A0BACE934B3CF31036F0ADBFC8DFB/0?term=3",
        "https://c2cpicdw.qpic.cn/offpic_new/1694605269//1694605269-234270907-E8FA49DF2ABA63988499D5C50B580EB7/0?term=3",
        "https://c2cpicdw.qpic.cn/offpic_new/1694605269//1694605269-2017850327-D641BD024F177F439AF1DF4FC4583C00/0?term=3"
    ];
    return [segment.image(imgs[Math.floor(Math.random() * imgs.length)])];
}

// 从右往左 返回搜索到的第一个标识符之前的所有字符
function findSubstrBeforeSym(string, symbol) {
    if (typeof string !== "string") return null;
    for (let cnt = string.length - 1; cnt >= 0; cnt--) {
        if (string[cnt] == symbol)
            return string.slice(0, cnt);
    }
    return null;
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

export { apply };