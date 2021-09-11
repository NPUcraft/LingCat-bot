"use strict"
const fs = require("fs");
const path = require("path");

/**
 * 上线提示,并更新数据
 */
async function online(_bot, data) {
	console.log(`我是${_bot.nickname}(${_bot.uin})，我有${_bot.fl.size}个好友，${_bot.gl.size}个群`);
	const botInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));
	console.log(`[${botInfo.botNickname}]v${botInfo.version}载入完成`);
}
exports.online = online;
