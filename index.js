"use strict"
const account = 1330615670; // bot_id

const bot = require("oicq").createClient(account)

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

// require("./plugins/plugin-online"); // 监听上线事件【调试请注释】
require("./plugins/plugin-poke") //戳一戳
require("./plugins/plugin-increase"); //监听群员入群事件


/* === test plugins === */
require("./plugins/24points/plugin-24points");  // 24点游戏
require("./plugins/plugin-at") //at 事件
require("./plugins/custom-reply/plugin-custom-reply");  // 自定义回复 //骂人功能
require("./plugins/plugin-sendsl") //-sendsl留言功能
require("./plugins/plugin-private") //监听私聊并回复
/* ==== NOT STABLE ==== */