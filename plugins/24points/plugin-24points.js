"use strict"
const { segment, cqcode } = require("oicq");
const { Score } = require("./Score");
const { getPermission } = require("../../lib/permission");
let playingGID = [];        // 记录游戏中的群号
let tempPointData = {}; // 记录临时点数
const help = `
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

//-24点
async function g24points(_bot, data, args = null) {
    if (!await getPermission(data, "24点")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 1 && ["排行榜", 'ranking'].indexOf(args?.[0]) !== -1) {
        let card = data.sender.card;
        new Score().updateName(data.user_id, card === '' ? data.sender.nickname : card);
        data.reply(await getRanking(data.user_id));
        return;
    } else if (args?.length > 1) {
        return;
    }
    if (playingGID.indexOf(data.group_id) !== -1) { // 开始游戏则发送正在游戏的信息
        let dataObj = tempPointData[data.group_id];
        data.reply([
            segment.text(`${dataObj.data}，目标点数：${dataObj.target}`),
            segment.face(306),
        ]);
        return;
    }
    playingGID.push(data.group_id);

    let game24Points = require("./games");
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
        segment.text(`${pointData}，目标点数：${target}， 你有${chances}次机会哦~`),
        segment.face(306),
    ]);
    let startTime = Buffer.from(startMsgId?.["data"]?.["message_id"], "base64").readUInt32BE(16);

    // 十分钟超时结束游戏
    let gameTimeOut = new setTimeout(async () => {
        data.reply("没人玩24点我就溜啦~");
        let index = playingGID.indexOf(data.group_id);
        playingGID.splice(index, 1);
        _bot.off("message.group.normal", solve);
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
                _bot.off("message.group.normal", solve);
            }
        }
    }
    _bot.on("message.group.normal", solve);

    function buildingMessage(state, chances) {
        let message;
        switch (state) {
            case "wrongAnswer": // 答错
                message = "你错了" + cqcode.face(317) + "还有" + chances + "次机会哦~";
                break;

            case "rightAnswer": // 答对
                message = cqcode.face(299) + "恭喜你答对辣！";
                break;

            case "tricks": // 使用花招
                message = cqcode.face(266) + `咳咳，不要耍小花招~你还有${chances}次机会哦~`;
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

exports.g24points = g24points;

async function getRanking(user_id = null) {
    const uid = String(user_id);
    let scoreList = new Score().getScoreList();
    let sortedScoreKeys = Object.keys(scoreList).sort((a, b) => {
        return (scoreList[b].score - scoreList[a].score) || (scoreList[a].time - scoreList[b].time);
    });
    if (sortedScoreKeys.length === 0) return "暂无24点游戏排行信息~";
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
    if (typeof scoreList[uid] === "undefined") ending += (cqcode.at(user_id) + `尚未参与24点游戏，快来和我们一起玩耍吧~`);
    else {
        let rank = sortedScoreKeys.indexOf(uid) + 1;
        ending += `${rank <= 10 ? `恭喜你` + cqcode.at(user_id) + `目前排行第${rank}` : cqcode.at(user_id) + `目前排行第${rank}，尚未上榜，再接再厉哦~`}`;
    }
    return `${header}\n${content}${ending}`;
}

const formatString = (len, str, symbol) => {
    const totalLength = len;
    const strLength = str.length;
    const l = Math.floor((totalLength - strLength) / 2);
    return `${str.padEnd(strLength + l, symbol).padStart(totalLength, symbol)}`
}