console.log('plugin-jrrp loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import seedRandom from "../../lib/seed-random.js";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
查看今日人品
            `.trim();
    });

    hook('onMessage', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname, [e.flag, e.cmd])) return;
        /* 解析命令 参数未知报错提示 */
        if (typeof e.args === "string") {
            e.data.reply(e.args);
            return;
        }

        /* 根据参数列表实现次级功能 */
        let subCmd = false;
        for (const arg in e.args) {
            if (arg == "h") {
                e.data.reply(help);
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(getJrrp(e.data));
        }
    });
}

function getJrrp(data) {
    let jrrp = loadFileAsJson(`${__dirname}/jrrp.json`);
    let today = new Date();
    const seedID = data.sender.user_id + today.toLocaleDateString();
    let randomNum = seedRandom.getRandomIntInclusive(seedID, jrrp.min, jrrp.max);
    let sender = data.sender.card ? data.sender.card : data.sender.nickname;
    randomNum = (today.getTime() > new Date(jrrp.fromDate[0], jrrp.fromDate[1] - 1, jrrp.fromDate[2] - 1).getTime() && today.getTime() < new Date(jrrp.toDate[0], jrrp.toDate[1] - 1, jrrp.toDate[2] - 1).getTime()) ? jrrp.specialNumber[(randomNum % jrrp.specialNumber.length + jrrp.specialNumber.length) % jrrp.specialNumber.length] : randomNum;
    return `${sender} 今日的人品为 ${randomNum}`;
}

export { apply };