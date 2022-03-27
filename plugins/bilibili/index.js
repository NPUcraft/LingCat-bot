console.log('plugin-bilibili loaded');

import _ from "lodash";
import { addLive, removeLive, listLive, getLiveStatus, parseBiliShare, viewVideo, getEveryLiveStatus } from "./biliLiveHandle.js";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
const CD = 3;
let lastInvokeTime = 0;

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
推送已关注up的直播信息(和投稿信息[摸了])
<-bili -s uid>: (subscribe) 关注up 
<-bili -u uid/name>: (unsubscribe) 取关up
<-bili -l> : (list) 查看关注的up列表
<-bili -r uid>: (room) 查看该直播间状态
<-bili -v 搜索内容/BV号>: (video) 查看视频信息，默认为搜索第一个结果
            `.trim();
        setInterval(getEveryLiveStatus, 1 * 30 * 1000, bot);   // bilibili直播状态推送
    });

    hook('onMessage', async function (e) {
        // 分享哔站视频则不检查命令权限
        if (e.data.message[0]["type"] == "json") {
            let jsonData = JSON.parse(e.data.message[0]["data"]);
            if (jsonData["desc"] !== "哔哩哔哩") return
            if (!getPermission(e.data, __dirname)) return;
            e.data.reply(await parseBiliShare(jsonData));
            return;
        } else
            if (!getPermission(e.data, __dirname, [e.flag, e.cmd])) return;

        // 添加命令cd
        if (e.data.time - lastInvokeTime < CD) {
            e.data.reply(`让我冷静${CD - e.data.time + lastInvokeTime}秒`);
            return;
        }

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
            } else if (arg == "s") {
                if (e.data.sender.role == "member") e.data.reply("权限不足！");
                else e.data.reply(await addLive(e.data.group_id, Number(e.args[arg])));
                subCmd = true;
                break;
            } else if (arg == "u") {
                if (e.data.sender.role == "member") e.data.reply("权限不足！");
                else e.data.reply(await removeLive(e.data.group_id, e.args[arg]));
                subCmd = true;
                break;
            } else if (arg == "l") {
                e.data.reply(await listLive(e.data.group_id));
                subCmd = true;
                break;
            } else if (arg == "v") {
                e.data.reply(await viewVideo(e.args[arg]));
                subCmd = true;
                break;
            } else if (arg == "r") {
                e.data.reply(await getLiveStatus(e.data.group_id, Number(e.args[arg])));
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(help);
        }
    });

}

export { apply };