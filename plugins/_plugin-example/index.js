console.log('plugin-example loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { writeConfigSync, loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

// let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        // /* Initialize */
        // cfg = loadFileAsJson(`${__dirname}/config.json`);
        // help = `

        //     `.trim();
    });

    hook('onMessage', function (e) {
        // /* DO IT */
        // /* 检查命令是否匹配及其功能使用权限 */
        // if (!getPermission(e.data, __dirname, [e.flag, e.cmd])) return;
        // /* 解析命令 参数未知报错提示 */
        // if (typeof e.args === "string") {
        //     e.data.reply(e.args);
        //     return;
        // }

        // /* 根据参数列表实现次级功能 */
        // let subCmd = false;
        // for (const arg in e.args) {
        //     if (arg == "h") {
        //         e.data.reply(help);
        //         subCmd = true;
        //         break;
        //     } else if (arg == "arg1") {

        //         subCmd = true;
        //         break;
        //     } else if (arg == "arg2") {

        //         subCmd = true;
        //         break;
        //     }
        // }
        // if (!subCmd) {
        //     /* 无子命令时执行主功能程序 */
        // }
    });

    hook('onNotice', function (e) {
        // /* 检查命令是否匹配及其功能使用权限 */
        // if (!getPermission(e.data, __dirname)) return;
    });
}

export { apply };