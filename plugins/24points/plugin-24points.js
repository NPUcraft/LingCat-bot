"use strict"
const { bot } = require("../../index");
const { segment, cqcode } = require("oicq");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"))).mongo;
const mongodbUtils = require("../../lib/mongodb");
const database = databaseInfo.database;
const collection = databaseInfo.collection;
const { getPermission } = require("../../lib/permission");
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
async function g24points(data, args) {
    if (!await getPermission(data, "24点")) return;
    if (args.length > 0) {
        data.reply(help);
        return;
    }
    if (args.length === 0) {
        let freeStatus = await mongodbUtils.findAndUpdateDocument(database, collection,
            { "group_id": data.group_id }, { "_24点.free": false });
        if (!freeStatus.value["_24点"].free) {
            let dataObj = await mongodbUtils.getData(database, collection,
                { "group_id": data.group_id }, "_24点.points");
            data.reply([
                segment.text(`${dataObj.data}，目标点数：${dataObj.target}`),
                segment.face(306),
            ]);
            return;
        }

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
        await mongodbUtils.findAndUpdateDocument(database, collection,
            { "group_id": data.group_id }, {
            "_24点.points": {
                "data": pointData,
                "target": target
            }
        });
        data.reply([
            segment.text(`${pointData}，目标点数：${target}， 你有${chances}次机会哦~`),
            segment.face(306),
        ]);

        if (chances > 0) {
            // 十分钟超时结束游戏
            let gameTimeOut = new setTimeout(async () => {
                data.reply("没人玩24点我就溜啦~")
                await mongodbUtils.findAndUpdateDocument(database, collection,
                    { "group_id": data.group_id }, { "_24点.free": true });
                chances = 0;
                return;
            }, 10 * 60 * 1000);

            bot.on("message.group.normal", async (event) => {
                if (event.group_id === data.group_id) {
                    if (!chances) {
                        return 0;
                    }

                    try {
                        if (game24Points.check(my24Point.data, target, event.raw_message)) {
                            event.reply(buildingMessage("rightAnswer", chances));
                            clearTimeout(gameTimeOut);
                            await mongodbUtils.findAndUpdateDocument(database, collection,
                                { "group_id": data.group_id }, { "_24点.free": true });
                            chances = 0;
                            return 0;
                        } else {
                            chances--;
                            if (!chances) {
                                event.reply(buildingMessage("giveRightAns", chances));
                                clearTimeout(gameTimeOut);
                                await mongodbUtils.findAndUpdateDocument(database, collection,
                                    { "group_id": data.group_id }, { "_24点.free": true });
                                return 0;
                            }
                            event.reply(buildingMessage("wrongAnswer", chances));
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
                                    clearTimeout(gameTimeOut);
                                    await mongodbUtils.findAndUpdateDocument(database, collection,
                                        { "group_id": data.group_id }, { "_24点.free": true });
                                    return 0;
                                }
                                event.reply(buildingMessage("tricks", chances));
                                break;

                            case "验证此题无解":
                                chances--;
                                if (!chances) {
                                    event.reply(buildingMessage("giveRightAns", chances));
                                    clearTimeout(gameTimeOut);
                                    await mongodbUtils.findAndUpdateDocument(database, collection,
                                        { "group_id": data.group_id }, { "_24点.free": true });
                                    return 0;
                                }
                                event.reply(cqcode.face(306) + `想什么呢你？再给你${chances}次机会哈`);
                                break;

                            default:
                                break;
                        }
                    }
                }
            })
        }

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

}
module.exports = g24points;