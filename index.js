"use strict"
const fs = require("fs");
const path = require("path");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json")));
const account = botInfo.account; // bot_id
const parseCommand = require("./lib/command");
const bot = require("oicq").createClient(account, {
    platform: 5
})


bot.on("system.login.qrcode", function (e) {
    this.logger.mark("扫码后按Enter完成登录") //通过扫码二维码登录
    process.stdin.once("data", () => {
        this.login()
    })
})
    .on("system.login.error", function (e) {
        if (e.code < 0)
            this.login()
    })
    .login()
exports.bot = bot

/* ====== Plugins ====== */
// 系统类插件直接加载
require("./plugins/plugin-online"); // 机器人上线事件
const { whatsUp } = require("./plugins/plugin-private");   // 私聊敷衍

const { install, update } = require("./plugins/plugin-install"); // 安装|更新机器人
const { banned } = require("./plugins/plugin-ban");   // 机器人被禁言，[所有]功能禁用
const { turnOff, turnOn } = require("./plugins/plugin-manage");      // 插件开关
const { helpList } = require("./plugins/plugin-help");       // 帮助菜单
const { setReply, deleteReply, customReply } = require("./plugins/plugin-custom-reply");
const { g24points } = require("./plugins/24points/plugin-24points");   // 24点游戏
const { jrjh } = require("./plugins/jr-dontstarve/plugin-jrjh");      // 今日饥荒菜谱
const { jrrp } = require("./plugins/plugin-jrrp");        // 今日人品
const { ticTactics } = require("./plugins/tic-tactics/plugin-tic-tactics");     // 超级井字棋
const { baiduForU } = require("./plugins/plugin-baidu-for-u");     // 为你百度
const { sendsl } = require("./plugins/plugin-sendsl");    // 反馈

const { increase } = require("./plugins/plugin-increase");      // 入群欢迎
const { poke } = require("./plugins/plugin-poke");    // 戳一戳

// 群消息监听类插件
bot.on("message.group.normal", (e) => {
    let [cmd, ...args] = parseCommand(e.raw_message);
    cmd = cmd ? cmd : e.raw_message;
    switch (cmd) {
        case "-sendsl":     // -sendsl留言功能
            sendsl(e, args);
            break;
        case "-今日菜品":       // 今日饥荒菜谱
            jrjh(e, args);
            break;
        case "-jrrp":       //今日人品
            jrrp(e);
            break;
        case "#开启":       // 开启插件
            turnOn(e, args);
            break;
        case "#关闭":       // 关闭插件
            turnOff(e, args);
            break;
        case "-help":       // 帮助菜单
            helpList(e, args);
            break;
        case "-百度":       // 为你百度（恶搞）
            baiduForU(e, args);
            break;
        case "-24点":       // 24点游戏
            g24points(e, args);
            break;
        case "-井字棋":
            ticTactics(e, args);
            break;
        case "#set":        // 添加自定义词
            setReply(e, args[0], args[1]);
            break;
        case "#del":        // 删除自定义词
            deleteReply(e, args);
            break;
        case "#install":    // 安装
            install(e);
            break;
        case "#update":     // 更新
            update(e);
            break;
        default:            // 触发自定义回复
            customReply(e, cmd);
            break;
    }
})

// 私聊消息监听类插件
bot.on("message.private", (e) => {
    whatsUp(e);     // 私聊敷衍
})

// 群通知类插件
bot.on("notice.group", (e) => {
    switch (e.sub_type) {
        case "increase":        //监听群员入群事件
            increase(e);
            break;
        case "poke":            //戳一戳
            poke(e);
            break;
        case "ban":             // 机器人被禁言，[所有]功能禁用
            banned(e);
            break;
        // case "recall":          // 跟随撤回
        //     require("./plugins/plugin-follow-recall")(e);
        //     break;
        default:
            break;
    }
})

/* === test plugins === */
// require("./plugins/custom-reply/plugin-custom-reply");  // 自定义回复
/* ==== NOT STABLE ==== */