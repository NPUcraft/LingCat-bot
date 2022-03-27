console.log('plugin-mc-enchant loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import { segment } from "oicq";
import fs from "fs";
import { writeConfigSync, loadFileAsJson } from "../../lib/file-system.js";
import { enchant } from "./enchantHandle.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
import seedRandom from "../../lib/seed-random.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
MC附魔模拟器
<-fm 下界合金剑>等：给物品附魔
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
            e.data.reply(getEnchantment(e.data, e.rawArgs.trim()))
        }
    });
}

function getEnchantment(data, item, choice = 2) {
    if (item.length === 0) return help;
    // 根据今日人品确定附魔等级
    let today = new Date();
    const seedID = data.sender.user_id + today.toLocaleDateString();
    let randomNum = seedRandom.getRandomIntInclusive(seedID, 0, 100);
    choice = (randomNum < 33 ? 0 : (randomNum < 66 ? 1 : 2));
    let enchantments = enchant(item, choice);
    if (typeof enchantments === "string") return enchantments;
    let enchantmentString = [];
    for (const key in enchantments) {
        enchantmentString.push(`${key}${enchantments[key]}`);
    }
    // "╔  ═  ╗  ║  ╠  ╣  ╚  ╝"
    return msg(data, item, enchantmentString);
}

function msg(data, item, enchantments) {
    let imageData = fs.readFileSync(`${__dirname}/item/${item}.png`);
    let headMsg = `\n附魔物品：${item}`;
    let enchantmentMsg = `\n${enchantments.join("\n")}`;

    return [segment.at(data.user_id), headMsg, segment.image(imageData), enchantmentMsg];
}

export { apply };