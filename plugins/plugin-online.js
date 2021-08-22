"use strict"
const { bot } = require("../index");
const fs = require("fs");
const path = require("path");

/**
 * 灵喵上线提示,并更新数据
 */
bot.once("system.online", async function () {
	// 你的账号已上线，你可以做任何事
	console.log(`我是${this.nickname}(${this.uin})，我有${this.fl.size}个好友，${this.gl.size}个群`);
	const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
	console.log(`[${botInfo.botNickname}]v${botInfo.version}载入完成`);
})
