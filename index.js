"use strict"
const fs = require("fs");
const { segment } = require("oicq");
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

// 群消息监听类插件
bot.on("message.group.normal", (e) => {
    let [cmd, ...args] = parseCommand(e.raw_message);
    cmd = cmd ? cmd : e.raw_message;
    switch (cmd) {
        case "-sendsl":     // -sendsl留言功能
            require("./plugins/plugin-sendsl")(e, args);
            break;
        case "-今日菜品":       // 今日饥荒菜谱
            require("./plugins/jr-dontstarve/plugin-jrjh")(e, args);
            break;
        case "-jrrp":       //今日人品
            require("./plugins/plugin-jrrp")(e);
            break;
        case "#开启":       // 开启插件
            const { turnOn } = require("./plugins/plugin-manage");
            turnOn(e, args);
            break;
        case "#关闭":       // 关闭插件
            const { turnOff } = require("./plugins/plugin-manage");
            turnOff(e, args);
            break;
        case "-help":       // 帮助菜单
            const { helpList } = require("./plugins/plugin-help");
            helpList(e, args);
            break;
        case "-百度":       // 为你百度（恶搞）
            require("./plugins/plugin-baidu-for-u")(e, args);
            break;
        case "-24点":       // 24点游戏
            require("./plugins/24points/plugin-24points")(e, args);
            break;
        case "-井字棋":
            require("./plugins/tic-tactics/plugin-tic-tactics")(e, args);
            break;
        case "#set":        // 添加自定义词
            const { setReply } = require("./plugins/plugin-custom-reply");
            if (args[1] == '') return;
            setReply(e, args[0], args[1]);
            break;
        case "#del":        // 删除自定义词
            const { deleteReply } = require("./plugins/plugin-custom-reply");
            deleteReply(e, args);
            break;
        default:            // 触发自定义回复
            const { customReply } = require("./plugins/plugin-custom-reply");
            customReply(e, cmd);
            break;
    }
})

// 私聊消息监听类插件
bot.on("message.private", (e) => {
    require("./plugins/plugin-private")(e);
})

// 群通知类插件
bot.on("notice.group", (e) => {
    switch (e.sub_type) {
        case "increase":        //监听群员入群事件
            require("./plugins/plugin-increase")(e);
            break;
        case "poke":            //戳一戳
            require("./plugins/plugin-poke")(e);
            break;
        case "ban":             // 机器人被禁言，[所有]功能禁用
            require("./plugins/plugin-ban")(e);
            break;
        // case "recall":          // 跟随撤回
        //     require("./plugins/plugin-follow-recall")(e);
        //     break;
        default:
            break;
    }
})

/* === test plugins === */
require("./plugins/custom-reply/plugin-custom-reply");  // 自定义回复
/* ==== NOT STABLE ==== */