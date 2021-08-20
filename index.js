"use strict"
const account = 447010560; // bot_id

const bot = require("oicq").createClient(account)
const parseCommand = require("./lib/command");

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
// require("./plugins/plugin-online"); // 监听上线事件【调试请注释】

// 群消息监听类插件
bot.on("message.group.normal", (e) => {
    let [cmd, ...args] = parseCommand(e.raw_message);
    switch (cmd) {
        case "-sendsl":     // -sendsl留言功能
            require("./plugins/plugin-sendsl")(e, args);
            break;
        case "-今日菜品":       // 今日饥荒菜谱
            require("./plugins/jr-dontstarve/plugin-jrjh")(e, args);
            break;
        case "#开启":       // 开启插件
            const { turnOn } = require("./plugins/plugin-manage");
            turnOn(e, args);
            break;
        case "#关闭":       // 关闭插件
            const { turnOff } = require("./plugins/plugin-manage");
            turnOff(e, args);
            break;
        default:
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
        default:
            break;
    }
})

/* === test plugins === */
// require("./plugins/24points/plugin-24points");  // 24点游戏
// require("./plugins/custom-reply/plugin-custom-reply");  // 自定义回复
/* ==== NOT STABLE ==== */