"use strict"
const log4js = require("log4js");
const fs = require("fs");
const path = require("path");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json")));
const account = botInfo.account;
const parseCommand = require("./lib/command");
const bot = require("oicq").createClient(account, {
    platform: 5
})

const errorHandler = (err) => { throw err };
// 日志记录配置
log4js.configure({
    appenders: {
        fileout: {
            type: 'dateFile',
            //文件名 = filename + pattern, 设置为alwaysIncludePattern：true
            filename: './logs/log',
            pattern: '.yyyy-MM-dd.log',
            // compress: true,
            //包含模型
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: { appenders: ["fileout"], level: "info" }
    }
});

bot.on("system.login.qrcode", function (e) {
    this.logger.mark("扫码后按Enter完成登录") //通过扫码二维码登录
    process.stdin.once("data", () => {
        this.login()
    })
}).on("system.login.error", function (e) {
    if (e.code < 0)
        this.login()
}).login()

/* =========== Plugins =========== */
// 系统类插件
const { online } = require("./plugins/plugin-online");      //  机器人上线事件
// 私聊类插件
const { whatsUp } = require("./plugins/plugin-private");   // 私聊敷衍
// 群聊类插件
const { install, update } = require("./plugins/plugin-install"); // 安装|更新机器人
const { banned } = require("./plugins/plugin-ban");   // 机器人被禁言，[所有]功能禁用
const { turnOff, turnOn } = require("./plugins/plugin-manage");      // 插件开关
const { helpList } = require("./plugins/plugin-help");       // 帮助菜单
const { setReply, deleteReply, customReply, getReplyList } = require("./plugins/plugin-custom-reply");
const { g24points } = require("./plugins/24points/plugin-24points");   // 24点游戏
const { jrjh } = require("./plugins/jr-dontstarve/plugin-jrjh");      // 今日饥荒菜谱
const { jrmc } = require("./plugins/jrmc/plugin-jrmc");       // 今日MC
const { jrrp } = require("./plugins/plugin-jrrp");        // 今日人品
const { jrmchl } = require("./plugins/plugin-jrmchl");        // 今日mc运势
const { chp } = require("./plugins/plugin-chp");       // 彩虹屁
const { ticTactics } = require("./plugins/tic-tactics/plugin-tic-tactics");     // 超级井字棋
const { baiduForU } = require("./plugins/plugin-baidu-for-u");     // 为你百度
const { send } = require("./plugins/plugin-send");    // 反馈
const { biliLive, getEveryLiveStatus } = require("./plugins/bilibili/plugin-bili-live"); // bili直播间
const { ping } = require("./plugins/mcbot/plugin-mcbot");   // mcbot
const { repeater } = require("./plugins/plugin-repeater");      // 复读
const { noAbbreviated } = require("./plugins/plugin-yyds");      // 好好说话 
const { getWordCloud, getMessage } = require("./plugins/wordCloud/plugin-wordcloud");       // 词云分析
const { echo } = require("./plugins/plugin-echo");  // 复述功能
// 通知类插件
const { increase } = require("./plugins/plugin-increase");      // 入群欢迎
const { decrease } = require("./plugins/plugin-decrease");     // 退群
const { poke } = require("./plugins/plugin-poke");    // 戳一戳


bot.once("system.online", function (e) {
    online(this, e);
});

// 群消息监听类插件
bot.on("message.group.normal", function (e) {
    let _bot = this;
    let [cmd, ...args] = parseCommand(e.raw_message);
    cmd = cmd ? cmd : e.raw_message;
    const msgHandle = async function (cmd, e, args) {
        switch (cmd) {
            case "-echo":     // -复述功能
                await echo(_bot, e, args).catch(errorHandler);
                break;
            case "-send":     // -send留言功能
                await send(_bot, e, args).catch(errorHandler);
                break;
            case "-今日菜品":       // 今日饥荒菜谱
                await jrjh(_bot, e, args).catch(errorHandler);
                break;
            case "-jrmc":       // 今日MC
                await jrmc(_bot, e, args).catch(errorHandler);
                break;
            case "-今日运势":   // 今日mc运势
                await jrmchl(_bot, e, args).catch(errorHandler);
                break;
            case "-jrrp":       //今日人品
                await jrrp(_bot, e, args).catch(errorHandler);
                break;
            case "#开启":       // 开启插件
                await turnOn(_bot, e, args).catch(errorHandler);
                break;
            case "#关闭":       // 关闭插件
                await turnOff(_bot, e, args).catch(errorHandler);
                break;
            case "-help":       // 帮助菜单
                await helpList(_bot, e, args).catch(errorHandler);
                break;
            case "-百度":       // 为你百度（恶搞）
                await baiduForU(_bot, e, args).catch(errorHandler);
                break;
            case "-24点":       // 24点游戏
                await g24points(_bot, e, args).catch(errorHandler);
                break;
            case "-井字棋":     // 井字棋
                await ticTactics(_bot, e, args).catch(errorHandler);
                break;
            case "#set":        // 添加自定义词
                await setReply(_bot, e, args[0], args[1]).catch(errorHandler);
                break;
            case "#del":        // 删除自定义词
                await deleteReply(_bot, e, args).catch(errorHandler);
                break;
            case "-调教字典":   // 查看自定义回复列表
                await getReplyList(_bot, e, args).catch(errorHandler);
                break;
            case "#install":    // 安装
                await install(_bot, e, args).catch(errorHandler);
                break;
            case "#update":     // 更新
                await update(_bot, e, args).catch(errorHandler);
                break;
            case "-bili":       // bilibili相关工具
                await biliLive(_bot, e, args).catch(errorHandler);
                break;
            case "-彩虹屁":     // 彩虹屁
                await chp(_bot, e, args).catch(errorHandler);
                break;
            case "-mc":         // mcbot
                await ping(_bot, e, args).catch(errorHandler);
                break;
            // case "-wordcloud":  // 词云分析
            //     getWordCloud(_bot, e, args);
            //     break;
            default:
                // getMessage(_bot, e);
                await noAbbreviated(_bot, e).catch(errorHandler); // 好好说话
                await repeater(_bot, e).catch(errorHandler);      // 复读
                await customReply(_bot, e, cmd).catch(errorHandler);  // 触发自定义回复
                break;
        }
    };

    // 处理错误信息并汇报给主人
    msgHandle(cmd, e, args).catch(err => {
        this.logger.error(err);
        this.sendPrivateMsg(botInfo?.["owner"], err.message);
    })
})

// 私聊消息监听类插件
bot.on("message.private", function (e) {
    whatsUp(this, e);     // 私聊敷衍
})

// 群通知类插件
bot.on("notice.group", function (e) {
    let _bot = this;
    const msgHandle = async function (_bot, e) {
        switch (e.sub_type) {
            case "increase":        //监听群员入群事件
                await increase(_bot, e).catch(errorHandler);
                break;
            case "decrease":        //退群事件
                await decrease(_bot, e).catch(errorHandler);
                break;
            case "poke":            //戳一戳
                await poke(_bot, e).catch(errorHandler);
                break;
            case "ban":             // 机器人被禁言，[所有]功能禁用
                await banned(_bot, e).catch(errorHandler);
                break;
            default:
                break;
        }
    }

    // 处理错误信息并汇报给主人
    msgHandle(_bot, e).catch(err => {
        this.logger.error(err);
        this.sendPrivateMsg(botInfo?.["owner"], err.message);
    });
})

// 定时任务插件
let biliLiveId = setInterval(getEveryLiveStatus, 1 * 30 * 1000, bot);   // bilibili直播状态推送