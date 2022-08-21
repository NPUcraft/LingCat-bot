console.log('plugin-dida loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import download from "download";
import fs from "fs";
import { segment } from "oicq";
import { getPermission } from "../../lib/permission.js";
import { Data } from "./DidaData.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        help = `
滴答滴答：每日定时发送消息
<#dida -t 0830 定时内容>: 每日08:30发送定时内容 
<#dida 定时内容>: 每日当前时刻发送定时内容
<#dida -l>: 查看所有定时发送内容
<#dida -r 消息id>: 移除消息id对应的定时任务  
            `.trim();
        setInterval(getEveryDida, 1 * 60 * 1000, bot);   // 开启定时任务
    });

    hook('onMessage', async function (e) {
        // /* DO IT */
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
            } else if (arg == "t") {
                if (e.data.raw_message.trim() == "#dida") break;
                let time = "";
                if (e.args[arg] == "current") {
                    time = getCurrentTimeStr();
                } else {
                    time = e.args[arg];
                }
                e.data.reply(await addDida(e.data.group_id, time, e.data, e.args["_"]));
                subCmd = true;
                break;
            } else if (arg == "l") {
                e.data.reply(getDidaList(e.data.group_id))
                subCmd = true;
                break;
            } else if (arg == "r") {
                e.data.reply(removeDida(e.data.group_id, e.args[arg]))
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(help);
        }
    });
}

// 获取滴答清单
function getDidaList(group_id) {
    let didaList = new Data().getDidaList(group_id);
    let msgList = "";
    for (const didaid in didaList) {
        msgList += `消息id：${didaid}\n发送时间：${didaList[didaid]["time"]}\n消息内容：${didaList[didaid]["rawMessage"]}\n\n`;
    }
    let msg = [
        `该群滴答清单如下：\n`,
        `${msgList == "" ? "暂无" : msgList}`
    ];
    return msg;
}


// 添加滴答任务
async function addDida(group_id, time, data, contentList) {
    let content = data.message;
    let text = content[0]["text"];
    let content_index = text.indexOf(contentList.join("").substring(0, 1));
    content[0]["text"] = content_index == -1 ? "" : text.slice(content_index).trimStart();
    new Data().addDida({
        "time": time,
        "content": content,
        "rawMessage": data.raw_message.slice(data.raw_message.indexOf(contentList.join("").substring(0, 10))).trimStart()
    }, group_id);
    await saveImg(content, group_id);
    return `已添加定时任务！`;
}

// 删除滴答任务
function removeDida(group_id, didaid) {
    let didaList = new Data().getDidaList(group_id);
    if (Object.keys(didaList).indexOf(didaid) == -1) return "不存在该消息id";
    new Data().removeDida(didaid, group_id);
    return `已删除该定时任务！`;
}

// 每一分钟检查一次定时任务
async function getEveryDida(bot) {
    let data = new Data();
    let didaList = data.getDidaList();
    for (const id in didaList) {
        let g = bot.pickGroup(Number(id));
        // 构造虚拟通知类数据 使得通过权限验证
        if (!getPermission({ "group_id": id, "post_type": "notice", "notice_type": "group", "group": { "mute_left": g.mute_left } }, __dirname)) return;
        for (const didaid in didaList[id]) {
            if (didaList[id][didaid]["time"] == getCurrentTimeStr()) {
                await bot.sendGroupMsg(Number(id), buildSendableMsg_(didaList[id][didaid]["content"], id));
            }
        }
    }
}

async function saveImg(words, guid) {
    for (let w = 0; w < words.length; w++) {
        if (words[w].type == "image") {
            await download(words[w].url, `data/config/didaList-dist/${guid}`, { "filename": words[w].file });
        }
    }
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
            let imageData = fs.readFileSync(`data/config/didaList-dist/${gid}/${m?.file}`);
            replyMsg.push(segment.image(imageData));
        } else if (m.type === 'at') {
            replyMsg.push(segment.at(m?.qq));
        } else {
        }
    });
    return replyMsg;
}

function getCurrentTimeStr() {
    return PrefixInteger(new Date().getHours(), 2) + PrefixInteger(new Date().getMinutes(), 2);
    function PrefixInteger(num, m) {
        return (Array(m).join(0) + num).slice(-m);
    }
}
export { apply };