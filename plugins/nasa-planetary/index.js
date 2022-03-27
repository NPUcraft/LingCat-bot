console.log('plugin-jrap loaded');

import _ from "lodash";
import { segment } from "oicq";
import { GET } from "../../lib/http-utils.js";
import { writeFileSync, loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
let groupCD = {};

let help, invokeTime = 0;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */

        help = `
查看今日天文图片
【p.s. 图片略大 已设置1h冷却时间】
            `.trim();
    });

    hook('onMessage', async function (e) {
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
            if (groupCD[String(e.data.group_id)] !== void 0)
                if (e.data.time - groupCD[String(e.data.group_id)] < 1 * 60 * 60) {
                    e.data.reply(`图片略大 已设置1h冷却时间\n今天的天文图已经发送，下一发正在装填中...${1 * 60 * 60 - (e.data.time - groupCD[String(e.data.group_id)])}秒后再试试看吧~`);
                    return;
                }
            e.data.reply(await jrap(e.data));
        }
    });
}

async function jrap(data) {
    let apInfo;
    groupCD[String(data.group_id)] = data.time;
    if (data.time - invokeTime > 1 * 60 * 60) {   // 每一小时更新一次缓存文件
        invokeTime = data.time;
        apInfo = await getPlanetary();
        writeFileSync([__dirname, "cache.json"], JSON.stringify(apInfo, null, '\t'), true);
    } else {
        apInfo = loadFileAsJson([__dirname, "cache.json"]);
    }
    return [`${apInfo.date} [${apInfo.title}]\n\n${apInfo.explanation}\n`, segment.image(apInfo.url)];
}

const apiKey = loadFileAsJson("data/account.json").nasaAPIKey;
async function getPlanetary() {     // 获取今日天文图片信息
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    let apodInfo = await GET(url);
    return apodInfo.data;
}

export { apply };