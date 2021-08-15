//启用严格模式
"use strict";

//调用依赖模块
const { strict } = require('assert');
const fs = require('fs');
const { version } = require('os');
const { title, send } = require('process');
const cp = require("child_process");
const path = require("path");

//调用指定oicq模块
try {
    var { createClient, cqcode ,segment} = require("oicq");
} catch {
    var { createClient } = require("../index");
}

//读取properties.json
let json = fs.readFileSync('./properties.json', 'utf-8');
const obj = JSON.parse(json);
let uin = obj.uin;
let password = obj.password;
let NPU_group = obj.group_id;
let OP_group = obj.master_id;
let platform = obj.platform;
let author = obj.author;
let user_id = obj.user_id;
let lengthlimit = obj.lengthlimit;
let ver = obj.version;

//初始化调用函数模块
function count(input) {
    var t = typeof input;
    if (t == 'string') {
        return input.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in input) {
            n++;
        }
        return n;
    }
    return false;
}

function filter(input) {
    var k0 = RegExp(/CQ/);
    var m0 = RegExp(/&#/);
    let k = k0.test(input);
    let m = m0.test(input);
    var l = input.length;
    if (k != true && m != true && l <= lengthlimit) {
        return input
    }
    else return null
}

function filterMC(input) {
    var g0 = RegExp(/MINECRAFT/)
    var k0 = RegExp(/CQ/);
    var m0 = RegExp(/&#/);
    var v0 = RegExp(/玩家系统/);
    var z0 = RegExp(/拥有/);
    var z1 = RegExp(/个账户/);
    var n0 = RegExp(/您需要先通过验证才能聊天/);
    var d0 = RegExp(/当前有/);
    var d1 = RegExp(/个玩家在线/);
    var e0 = input.replace('\s+', '');
    let g = g0.test(input);
    let k = k0.test(input);
    let m = m0.test(input);
    let v = v0.test(input);
    let z = z0.test(input) && z1.test(input);
    let n = n0.test(input);
    let d = d0.test(input) && d1.test(input);
    if (g != true && k != true && m != true && v != true && z != true && n != true && d != true && input.startsWith('*') != true && input.startsWith('Type') != true && e0 != '') {
        return input
    }
    else return null
}

function RTrim(str) {
    var i;
    i = str.length
    str = str.substring(0, i - 1);
    return str;
}

//your account
const bot = createClient(uin, {
    log_level: "debug",
    platform: platform
});

//监听并输入滑动验证码ticket(同一设备只需验证一次)
bot.on("system.login.slider", () => {
    process.stdin.once("data", (input) => {
        bot.sliderLogin(input);
    });
});

//监听设备锁验证(同一设备只需验证一次)
bot.on("system.login.device", () => {
    bot.logger.info("验证完成后敲击Enter继续..");
    process.stdin.once("data", () => {
        bot.login();
    });
});

// login with your password or password_md5
bot.login(password);

//监听上线事件
bot.on("system.online", function () {
    console.log(`Logged in as ${this.nickname}!`);
    bot.sendGroupMsg(NPU_group, "[灵喵]v" + ver + "载入完成");
});

//自动同意好友申请
bot.on("request.friend.add", (data) => {
    bot.setFriendAddRequest(data.flag);
});

//监听私聊并回复
bot.on("message.private", (data) => {
    let user_id = obj.user_id;
    if (data.user_id != user_id) {
        bot.sendPrivateMsg(data.user_id, "喵~ 找窝干嘛?")
    };
});

//自定义回复
let textjs = fs.readFileSync('./text.json', 'utf-8');
const text = JSON.parse(textjs);
var welc = text.welc;
var npu = text.npu;
var jv = text.jv;
var map = text.map;

bot.on("message.group.normal", (data) => {
    switch (data.raw_message.toLowerCase()) {
        case 'jeff':
            var jeff = '[CQ:image,file=a893045c726957a48ba67e71b78a2b9633314-192-173.jpg,url=https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2301526193-A893045C726957A48BA67E71B78A2B96/0?term=3]'
            bot.sendGroupMsg(data.group_id, jeff);
            break;
        case "-help4":
            bot.sendGroupMsg(data.group_id,
                `1.欢迎新人
2.这是什么群
3.服务器官号
4.怎么下载JAVA
5.怎么截图
6.卫星地图
7.客户端异常退出怎么办
8.基岩版进服     `);
            break;
        case "欢迎新人":
            bot.sendGroupMsg(data.group_id, welc);
            break;
        case '服务器官号':
            var npuc = '现阶段我们在QQ与bilibili开设有官方宣传号' + "\n" + 'QQ：431167351(NPU-Minecraft)' + "\n" + 'B站：NPU-Minecraft' + "\n" + "服务器简介视频：https://b23.tv/2s9eiU";
            bot.sendGroupMsg(data.group_id, npuc);
            break;
        case "这是什么群":
            bot.sendGroupMsg(data.group_id, npu);
            break;
        case "怎么下载JAVA":
            bot.sendGroupMsg(data.group_id, jv);
            break;
        case "基岩版进服":
            var bedrock = 'NPUcraft通过Geyser插件实现JAVA-基岩版互通，群文件/基岩版（互通专供）安装包/内可获取相应版本'
            bot.sendGroupMsg(data.group_id, bedrock);
            break;
        case "怎么截图":
            var helps = `    请不要用手机对电脑屏幕拍照！

Minecraft游戏内截图键F2，图片保存在.minecraft→screenshots文件夹

win10系统全屏截图键prt screen，图片保存在剪切板中；alt+prt sc截图当前窗口，图片同保存在剪切板中；win+prt sc全屏截图，图片自动保存在此电脑→图片→屏幕截图文件夹

腾讯系应用(qq，微信)截图键ctrl+alt+a，可以手动框取指定大小的窗口截图，还能涂改编辑哟~，图片保存在剪切板中    `;
            bot.sendGroupMsg(data.group_id, helps);
            break;
        case "客户端异常退出怎么办":
            var v = `    客户端崩溃调试办法
1.首先检查内存分配有没有超，java路径对不对
2.独立显卡是英伟达的检查一下NVIDIA显卡设置里有没有将java.exe设置成使用高性能显卡启动(之后会出教程文档)
3.在hmcl启动器右下角先切换成原版启动;原版不能启动就删除.minecraft下的assets和libraries文件夹然后重试
4.在原版里创建单机存档看能不能打开
5.在原版里看看能不能登上服务器大厅
6.如果fabric版还是不能启动就重复步骤3
7.如果fabric版还是不行就一次禁用一两个mod，看看到底是禁用了哪个mod后能正常启动;或者一次只启用一两个，看看启用了哪个会崩(有些mod有依赖关系，之后会出说明文档)
8.用fabric版启动游戏后创建单机存档
9.用fabric版登录服务器
以上某一步出问题之后贴出崩溃报告/问题截图，并说明是哪一步，群友就可以更好的帮你解决问题鸭    `;
            bot.sendGroupMsg(data.group_id, v);
            break;
        case "卫星地图":
            bot.sendGroupMsg(data.group_id, map);
            break;
        case '-help':
            bot.sendGroupMsg(data.group_id,
                `-----Project SeaBit-----
    1.输入“-help”获取帮助
    2.使用“-sendsl"留言给汐灵
    3.发送“卫星地图”查看NPUcraft生存服地图
    4.自定义回复(输入-help4查看详情)
    5.自动同意好友申请和群邀请
    6.自动转发服务器公屏消息及通知至群聊
    7.使用-Say向服务器内发送消息
    8.服内发送“zzz”督促猫猫睡觉
    9.服内天气变化监测（自动执行） `);
            break;
        case '-cmdhelp':
            if (data.group_id == OP_group) {
                bot.sendGroupMsg(OP_group,
                    `-----灵喵命令模式使用说明-----
1.输入“-cmdhelp”获取帮助
2.输入“-title”+内容向全服执行title
3.输入“-kick”+玩家名称kick某一玩家
4.输入“-mute”+玩家名称禁言某一玩家
5.其他命令使用“-command”+完整命令语句执行`);
            }
            break;
        case `群……`:
            bot.sendGroupMsg(data.group_id, '大吉猫咪');
            break;
    }
})

//戳一戳
bot.on("notice.group.poke", (data) => {
    if (data.user_id == uin) {
        bot.sendGroupMsg(data.group_id, "嗷呜~");
    }
})

//at 事件
bot.on("message.group.normal", (data) => {
    let tag = data.raw_message;
    var n = tag.startsWith("[CQ:at,qq=3636520140")
    if (n == true) {
        var record = "喵~找窝干嘛？" + "[CQ:face,id=306,text=/牛气冲天]"
        bot.sendGroupMsg(data.group_id, record)
    }
});

//骂人功能
bot.on("message.group.normal", (data) => {
    var o0 = RegExp(/灵喵/);
    var o = o0.test(data.raw_message);
    if (o == true && data.sender.user_id != uin && data.sender.user_id != 1354825038 && data.group_id != OP_group) {
        bot.sendGroupMsg(data.group_id, "FAKE NEWS!");
    }
});

//-sendsl留言功能
bot.on("message.group.normal", (data) => {
    let tag = data.raw_message;
    var compair = tag.split(" ")[0];
    var send = tag.split(" ")[1];
    if (compair == "-sendsl") {
        var where = data.group_name;
        var who = data.sender.card;
        if (data.sender.card == '') {
            who = data.sender.nickname;
        };
        bot.sendPrivateMsg(user_id, "[" + where + "]" + "[" + who + "]" + send);
    }
});

//监听群员入群事件
bot.on("notice.group.increase", (data) => {
    var pics = '[CQ:image,file=23b9efe00cc09375e32b079da528868353102-200-200.gif,url=https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2873382820-23B9EFE00CC09375E32B079DA5288683/0?term=2]'
    bot.sendGroupMsg(data.group_id, "热烈欢迎" + data.nickname + " 加入NPUcraft!" + pics);
});

//自动同意群邀请
bot.on("request.group.invite", (data) => {
    bot.setGroupAddRequest(data.flag);
});

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