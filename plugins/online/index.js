console.log('plugin-online loaded');

import { loadFileAsJson } from "../../lib/file-system.js";

function apply(hook) {
    hook('onCreate', function (bot) {
        console.log(`我是${bot.nickname}(${bot.uin})，我有${bot.fl.size}个好友，${bot.gl.size}个群`);
        const botNickname = loadFileAsJson("data/account.json").botNickname;
        const version = loadFileAsJson("package.json").version;
        console.log(`[${botNickname}]v${version}载入完成`);
    });
}

export { apply };