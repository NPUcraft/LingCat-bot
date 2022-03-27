console.log('plugin-24p loaded');   // 提示已加载插件（非必要）

import { segment } from "oicq";
import { getPermission } from "../../lib/permission.js";
import _ from "lodash";
import { loadFileAsJson } from "../../lib/file-system.js";
import { parseArgs } from "../../lib/parse-args.js";
import { Score } from "./Score.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
let playingGID = [];        // 记录游戏中的群号
let tempPointData = {}; // 记录临时点数
import * as game24Points from "./games.js";

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
[游戏规则] 
要求四个数字通过加减乘除和括号运算等于二十四
[拓展] 
每日17:00~24:00要求运算等于一个随机目标点数
[写法说明] 
以下写法均合法：
※ (2+2)*(12/2)        
--最正常的写法
※ 4(12/3+2)           
--乘法的习惯性写法
※ （2加2)乘（12除以2)  
--最变态的写法
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
        /* 根据参数列表实现功能 */
        let subCmd = false;
        for (const arg in e.args) {
            if (arg == "h") {
                e.data.reply(help);
                subCmd = true;
                break;
            } else if (arg == "r") {
                let card = e.data.sender.card;
                new Score().updateName(e.data.user_id, card === '' ? e.data.sender.nickname : card);
                e.data.reply(getRanking(e.data.user_id));
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            await runGame(e.bot, e.data);
        }

    });
}

async function runGame(bot, data) {
    if (playingGID.indexOf(data.group_id) !== -1) { // 开始游戏则发送正在游戏的信息
        let dataObj = tempPointData[data.group_id];
        data.reply([
            `${dataObj.data}，目标点数：${dataObj.target}`,
            segment.face(306),
        ]);
        return;
    }
    playingGID.push(data.group_id);

    let chances = 2;
    // 根据时间段生成不同的目标点
    let now = new Date();
    let hour = now.getHours();
    let target = 24;
    if (hour >= 17) target = Math.floor(Math.random() * (24 - 8) + 8) * 2;

    // 找有解题目
    let my24Point = game24Points.twentyFourPoints(13, target);
    while (my24Point.result === false) {
        my24Point = game24Points.twentyFourPoints(13, target);
    }

    let pointData = JSON.stringify(my24Point.data);
    let field = String(data.group_id);
    tempPointData[field] = {
        "data": pointData,
        "target": target
    };
    let startMsgId = await data.reply([
        `${pointData}，目标点数：${target}， 你有${chances}次机会哦~`,
        segment.face(306),
    ]);
    // let startTime = Buffer.from(startMsgId?.["message_id"], "base64").readUInt32BE(16);
    let startTime = startMsgId?.["time"];

    // 十分钟超时结束游戏
    let gameTimeOut = new setTimeout(async () => {
        data.reply("没人玩24点我就溜啦~");
        let index = playingGID.indexOf(data.group_id);
        playingGID.splice(index, 1);
        bot.off("message.group.normal", solve);
    }, 10 * 60 * 1000);

    function solve(event) {
        if (event.group_id === data.group_id) {
            try {
                if (game24Points.check(my24Point.data, target, event.raw_message)) {
                    let card = event.sender.card;
                    let parsed = Buffer.from(event.message_id, "base64");
                    new Score().updateScore(parsed.readUInt32BE(4),
                        card === '' ? event.sender.nickname : card,
                        parsed.readUInt32BE(16) - startTime);
                    event.reply(buildingMessage("rightAnswer", chances));
                    chances = 0;
                    // bot.off("message.group.normal", solve);
                } else {
                    chances--;
                    if (!chances) {
                        event.reply(buildingMessage("giveRightAns", chances));
                        // bot.off("message.group.normal", solve);
                    } else {
                        event.reply(buildingMessage("wrongAnswer", chances));
                    }
                }
            } catch (error) {
                switch (error.message) {
                    case "错误的表达式！":
                        // bot.sendGroupMsg(data.group_id, "你使用了错误的表达式！");
                        break;

                    case "请用给定的数字解答！":
                        chances--;
                        if (!chances) {
                            event.reply(buildingMessage("giveRightAns", chances));
                        } else {
                            event.reply(buildingMessage("tricks", chances));
                        }
                        break;

                    case "验证此题无解":
                        chances--;
                        if (!chances) {
                            event.reply(buildingMessage("giveRightAns", chances));
                        } else {
                            event.reply(cqcode.face(306) + `想什么呢你？再给你${chances}次机会哈`);
                        }

                        break;

                    default:
                        break;
                }
            }

            if (!chances) {
                let index = playingGID.indexOf(event.group_id);
                playingGID.splice(index, 1);
                clearTimeout(gameTimeOut);
                bot.off("message.group.normal", solve);
            }
        }
    }
    bot.on("message.group.normal", solve);

    function buildingMessage(state, chances) {
        let message;
        switch (state) {
            case "wrongAnswer": // 答错
                message = ["你错了", segment.face(317), "还有" + chances + "次机会哦~"];
                break;

            case "rightAnswer": // 答对
                message = [segment.face(299), "恭喜你答对辣！"];
                break;

            case "tricks": // 使用花招
                message = [segment.face(266), `咳咳，不要耍小花招~你还有${chances}次机会哦~`];
                break;

            case "noAnswer": // 给出无解
                message = "很遗憾你错了，游戏结束，这道题无解哎嘿~";
                break;

            case "giveRightAns": // 给出答案
                message = "很遗憾你错了，游戏结束~给你几个答案看看吧：\n";
                for (let index = 0; (index < my24Point.result.length) && index < 5; index++) {
                    message += my24Point.result[index];
                    message += `\n`;
                }
                break;

            default:
                message = "这啥情况，我不造啊？？？";
                break;
        }
        return message;
    }
}

function getRanking(user_id = null) {
    let msg = [];
    const uid = String(user_id);
    let scoreList = new Score().getScoreList();
    let sortedScoreKeys = Object.keys(scoreList).sort((a, b) => {
        return (scoreList[b].score - scoreList[a].score) || (scoreList[a].time - scoreList[b].time);
    });
    if (sortedScoreKeys.filter(i => scoreList[i]["score"] !== 0).length === 0) return "暂无24点游戏排行信息~";
    let content = "";
    const header = `${formatString(21, '   24点排行榜', " ")}\n${formatString(21, '', "=")}\n昵称 | 积分 | 平均用时(s)\n${formatString(21, '', "=")}`;
    let top10 = sortedScoreKeys.slice(0, 10);
    for (let index = 0; index < top10.length; index++) {
        const element = top10[index];
        let uname = scoreList[element]["uname"];
        if (uname.length > 6) uname = uname.replace(uname.slice(2, uname.length - 4), "**");
        content += `${formatString(10, uname, " ")} | ${formatString(4, String(scoreList[element]["score"]), " ")} | ${formatString(4, String((scoreList[element]["time"] / scoreList[element]["score"]).toFixed(1)), " ")}\n`;
    }
    let ending = `${formatString(21, '', "=")}\n`;
    msg.push(`${header}\n${content}${ending}`);
    if (typeof scoreList[uid] === "undefined") {
        msg.push(segment.at(user_id));
        msg.push(`尚未参与24点游戏，快来和我们一起玩耍吧~`);
    }
    else {
        let rank = sortedScoreKeys.indexOf(uid) + 1;
        if (rank <= 10) {
            msg.push(`恭喜你`);
            msg.push(segment.at(user_id));
            msg.push(`目前排行第${rank}`);
        } else {
            msg.push(segment.at(user_id));
            msg.push(`目前排行第${rank}，尚未上榜，再接再厉哦~`);
        }
    }
    return msg;
}

const formatString = (len, str, symbol) => {
    const totalLength = len;
    const strLength = str.length;
    const l = Math.floor((totalLength - strLength) / 2);
    return `${str.padEnd(strLength + l, symbol).padStart(totalLength, symbol)}`
}


export { apply };