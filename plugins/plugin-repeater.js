"use strict"
const { getPermission } = require("../lib/permission");
const msgList = {};

async function repeater(_bot, data, args = null) {
    if (!await getPermission(data, "repeater")) return;
    const startRepeat = 3;      // 从第三条开始复读
    const repeatProbability = 0.35;  // 复读概率
    const cd = 3;   // 若复读冷却条数
    const gid = String(data.group_id);
    if (typeof msgList?.[gid] === "undefined") msgList[gid] = [];
    if (msgList[gid].length === 25) msgList[gid] = [];  // 清理消息
    msgList[gid].push(data.raw_message);
    if (!isEqual(msgList[gid], startRepeat, cd, "✈")) return;
    let isSendMsg = Math.random() < repeatProbability;
    if (isSendMsg) {
        data.reply(data.raw_message);
        msgList[gid].push("✈");    // 标志已复读
    }
    console.log(msgList)
}
exports.repeater = repeater;

// 比较后n个元素是否相等
function isEqual(array, num, cd, symbol) {
    let symIndex = array.indexOf(symbol);
    if (symIndex !== -1 && symIndex + (cd + 1) < array.length) array = array.slice(symIndex + cd + 1);
    if (array.length < num) return false;
    let equal = true;
    for (let index = array.length - 1; index > array.length - num; index--) {
        if (array[index] !== array[index - 1]) {
            equal = false;
            break;
        }
    }
    return equal;
}