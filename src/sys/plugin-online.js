"use strict"
const { bot } = require("../../index");

/**
 * 灵喵上线提示
 */
bot.on("system.online", function () {
	// 你的账号已上线，你可以做任何事
	console.log(`已更新数据库: 我是${this.nickname}(${this.uin})，我有${this.fl.size}个好友，${this.gl.size}个群`)
})
