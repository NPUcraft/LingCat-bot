console.log('plugin-poke loaded');   // 提示已加载插件（非必要）

import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
const PR = 0.3;     // 30%触发回复


function apply(hook) {
    hook('onNotice', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname)) return;
        if (e.data.sub_type !== "poke") return;
        if (e.data.target_id !== e.data.self_id) return;
        if (Math.random() > PR) return;
        e.bot.sendGroupMsg(e.data.group_id, sendMsg(e.data));
    });
}

function sendMsg(data) {
    const words = loadFileAsJson([__dirname, "words.json"]);
    if (data.target_id === data.self_id) {
        return words[Math.floor(Math.random() * words.length)];
    }
}

export { apply };