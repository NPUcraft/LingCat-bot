console.log('plugin-mcbot loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { addServer, removeServer, getPlayersList, getServerPing, listServer } from "./mcHandle.js";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
<-mc -l>: 查看本群关注的服务器
<-mc -a name ip>: 添加服务器
<-mc -r name>: 移除服务器
<-mc -p>: ping一下默认服务器
<-mc -p ip/name>: ping一下指定服务器
<-mc -o>: 查看默认服务器在线玩家列表
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
            } else if (arg == "a") {
                e.data.reply(await addServer(e.data.group_id, e.args[arg], e.args["_"][0]));
                subCmd = true;
                break;
            } else if (arg == "r") {
                e.data.reply(await removeServer(e.data.group_id, e.args[arg]));
                subCmd = true;
                break;
            } else if (arg == "l") {
                e.data.reply(await listServer(e.data.group_id));
                subCmd = true;
                break;
            } else if (arg == "p") {
                e.data.reply(await getServerPing(e.data.group_id, e.args[arg]));
                subCmd = true;
                break;
            } else if (arg == "o") {
                e.data.reply(await getPlayersList(e.data.group_id));
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