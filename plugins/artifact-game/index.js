console.log('plugin-artifact loaded');

import _ from "lodash";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import { segment } from "oicq";
import { Data } from "./artifactHandle.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
与官方概率相当的刷圣遗物模拟器
<-syw 刷火本>等：刷圣遗物
<-syw -b 羽毛>等：查看已有圣遗物
<-syw -e 羽毛>等：强化0级圣遗物

注意：各部位0级和20级圣遗物只能存在一个，新圣遗物将取代旧圣遗物
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
            } else if (arg == "b") {
                e.data.reply(showOrEnhance(e.data, "b", e.args[arg]));
                subCmd = true;
                break;
            } else if (arg == "e") {
                e.data.reply(showOrEnhance(e.data, "e", e.args[arg]))
                subCmd = true;
                break;
            }
        }
        if (!subCmd) {
            e.data.reply(getArtifact(e.data, e.rawArgs.trim()));
        }
    });
}

function getArtifact(data, type) {
    if (type.trim().length === 0) return help;
    let ben = "";
    if (['刷火本', '刷魔女套', '刷魔女'].indexOf(type) !== -1) {
        ben = 'huo';
    } else if (['刷雷本'].indexOf(type) !== -1) {
        ben = 'lei';
    } else if (['刷风本', '刷风套', '刷少女套'].indexOf(type) !== -1) {
        ben = 'feng';
    } else if (['刷岩本', '刷磐岩套'].indexOf(type) !== -1) {
        ben = 'yan';
    } else if (['刷冰本', '刷冰套', '刷水套'].indexOf(type) !== -1) {
        ben = 'bing';
    } else if (['刷宗室本', '刷宗室套', '刷宗室'].indexOf(type) !== -1) {
        ben = 'zongShi';
    } else if (['刷物伤套', '刷苍白套', '刷千岩套'].indexOf(type) !== -1) {
        ben = 'cangBai';
    } else if (['刷华馆套', '刷海染套'].indexOf(type) !== -1) {
        ben = 'huaGuanHaiRan';
    } else if (['刷追忆套', '刷绝缘套', '刷充能套'].indexOf(type) !== -1) {
        ben = 'zhuiYiJueYuan';
    } else {
        return "请检查刷本名称";
    }
    return [segment.at(data.user_id), ` ${new Data().getArtifact(data.user_id, data.time, ben)}`];
}

function showOrEnhance(data, event, type) {
    let id = null;
    if (['花', '生之花'].indexOf(type) !== -1) {
        id = '0';
    } else if (['羽', '羽毛', '死之羽'].indexOf(type) !== -1) {
        id = '1';
    } else if (['沙', '沙漏', '时之沙'].indexOf(type) !== -1) {
        id = '2';
    } else if (['杯', '杯子', '空之杯'].indexOf(type) !== -1) {
        id = '3';
    } else if (['冠', '头', '理之冠'].indexOf(type) !== -1) {
        id = '4';
    } else if (['全部', '所有', 'all'].indexOf(type.toLowerCase()) !== -1) {
        id = 'all';
    } else {
        return `错误的关键词${type}`;
    }

    if (event == 'b') {
        return [segment.at(data.user_id), ` ${new Data().viewArtifact(data.user_id, id)}`];
    } else if (event == 'e') {
        return [segment.at(data.user_id), ` ${new Data().enhanceArtifact(data.user_id, id)}`];
    }
}

export { apply };