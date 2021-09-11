"use strict"
const fs = require("fs");
const path = require("path");
const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "./package.json")));
const account = botInfo.account;
const parseCommand = require("./lib/command");
const bot = require("oicq").createClient(account, {
    platform: 5
})


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
const { ticTactics } = require("./plugins/tic-tactics/plugin-tic-tactics");     // 超级井字棋
const { baiduForU } = require("./plugins/plugin-baidu-for-u");     // 为你百度
const { send } = require("./plugins/plugin-send");    // 反馈
// 通知类插件
const { increase } = require("./plugins/plugin-increase");      // 入群欢迎
const { decrease } = require("./plugins/plugin-decrease");     // 退群
const { poke } = require("./plugins/plugin-poke");    // 戳一戳


bot.once("system.online", function (e) {
    online(this, e);
});

// 群消息监听类插件
bot.on("message.group.normal", function (e) {
    let [cmd, ...args] = parseCommand(e.raw_message);
    cmd = cmd ? cmd : e.raw_message;
    switch (cmd) {
        case "-send":     // -send留言功能
            send(this, e, args);
            break;
        case "-今日菜品":       // 今日饥荒菜谱
            jrjh(this, e, args);
            break;
        case "-jrmc":       // 今日MC
            jrmc(this, e, args);
            break;
        case "-今日运势":   // 今日mc运势
            jrmchl(this, e, args);
            break;
        case "-jrrp":       //今日人品
            jrrp(this, e, args);
            break;
        case "#开启":       // 开启插件
            turnOn(this, e, args);
            break;
        case "#关闭":       // 关闭插件
            turnOff(this, e, args);
            break;
        case "-help":       // 帮助菜单
            helpList(this, e, args);
            break;
        case "-百度":       // 为你百度（恶搞）
            baiduForU(this, e, args);
            break;
        case "-24点":       // 24点游戏
            g24points(this, e, args);
            break;
        case "-井字棋":
            ticTactics(this, e, args);
            break;
        case "#set":        // 添加自定义词
            setReply(this, e, args[0], args[1]);
            break;
        case "#del":        // 删除自定义词
            deleteReply(this, e, args);
            break;
        case "-调教字典":   // 查看自定义回复列表
            getReplyList(this, e, args);
            break;
        case "#install":    // 安装
            install(this, e, args);
            break;
        case "#update":     // 更新
            update(this, e, args);
            break;
        default:            // 触发自定义回复
            customReply(this, e, cmd);
            break;
    }
})

// 私聊消息监听类插件
bot.on("message.private", function (e) {
    whatsUp(this, e);     // 私聊敷衍
})

// 群通知类插件
bot.on("notice.group", function (e) {
    switch (e.sub_type) {
        case "increase":        //监听群员入群事件
            increase(this, e);
            break;
        case "decrease":        //退群事件
            decrease(this, e);
            break;
        case "poke":            //戳一戳
            poke(this, e);
            break;
        case "ban":             // 机器人被禁言，[所有]功能禁用
            banned(this, e);
            break;
        default:
            break;
    }
})

/* === test plugins === */
// require("./plugins/custom-reply/plugin-custom-reply");  // 自定义回复
/* ==== NOT STABLE ==== */