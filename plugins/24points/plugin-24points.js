"use strict"
const { bot } = require("../../index");
const { segment, cqcode } = require("oicq");

//-24点
let is24PointsFree = true;
let game24Points = require("./games");
bot.on("message.group.normal", function (e) {
    if (e.raw_message === "-24点" && is24PointsFree) {
        is24PointsFree = false;
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
        e.reply([
            segment.text(`${pointData}，目标点数：${target}， 你有${chances}次机会哦~`),
            segment.face(306),
        ]);
        if (chances > 0) {
            // 十分钟超时结束游戏
            let gameTimeOut = new setTimeout(() => {
                e.reply("没人玩24点我就溜啦~")
                is24PointsFree = true;
                chances = 0;
                return 0;
            }, 10 * 60 * 1000);

            bot.on("message.group.normal", (event) => {
                if (event.group_id === e.group_id) {
                    if (!chances) {
                        return 0;
                    }

                    if (my24Point.result === false) { // 无解情况
                        try {
                            if (!game24Points.check(my24Point.data, target, event.raw_message)) {
                                chances--;
                                if (!chances) {
                                    event.reply(buildingMessage("noAnswer", chances));
                                    is24PointsFree = true;
                                    clearTimeout(gameTimeOut);
                                    return 0;
                                }
                                event.reply(buildingMessage("wrongAnswer", chances));
                            }
                        } catch (error) {
                            switch (error.message) {
                                case "验证此题无解":
                                    event.reply(buildingMessage("rightAnswer", chances) + " 此题无解！");
                                    is24PointsFree = true;
                                    clearTimeout(gameTimeOut);
                                    chances = 0;
                                    return 0;
                                    break;

                                case "错误的表达式！":
                                    // bot.sendGroupMsg(data.group_id, "请检查你的表达式");
                                    break;

                                case "请用给定的数字解答！":
                                    chances--;
                                    if (!chances) {
                                        event.reply(buildingMessage("noAnswer", chances));
                                        is24PointsFree = true;
                                        clearTimeout(gameTimeOut);
                                        return 0;
                                    }
                                    event.reply(buildingMessage("tricks", chances));
                                    break;

                                default:
                                    break;
                            }
                        }
                    } else { // 有解情况
                        try {
                            if (game24Points.check(my24Point.data, target, event.raw_message)) {
                                event.reply(buildingMessage("rightAnswer", chances));
                                clearTimeout(gameTimeOut);
                                is24PointsFree = true;
                                chances = 0;
                                return 0;
                            } else {
                                chances--;
                                if (!chances) {
                                    event.reply(buildingMessage("giveRightAns", chances));
                                    clearTimeout(gameTimeOut);
                                    is24PointsFree = true;
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
                                        is24PointsFree = true;
                                        return 0;
                                    }
                                    event.reply(buildingMessage("tricks", chances));
                                    break;

                                case "验证此题无解":
                                    chances--;
                                    if (!chances) {
                                        event.reply(buildingMessage("giveRightAns", chances));
                                        clearTimeout(gameTimeOut);
                                        is24PointsFree = true;
                                        return 0;
                                    }
                                    event.reply(cqcode.face(306) + `想什么呢你？再给你${chances}次机会哈`);
                                    break;

                                default:
                                    break;
                            }
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
})