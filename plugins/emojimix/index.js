console.log('plugin-emojimix loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import got from "got";
import { segment } from "oicq";
import { loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);
const emojiList = loadFileAsJson([__dirname, "./emoji.json"]);
let emojiDic = {};
for (const iterator of emojiList) {
    let uid = iterator[0].join("-");
    emojiDic[uid] = iterator[1];
}

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        help = getHelp();
    });

    hook('onMessage', async function (e) {
        /* DO IT */
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
            e.data.reply(await runEmojiMix(e.data.raw_message), true);
            /* 无子命令时执行主功能程序 */
        }
    });

}

async function runEmojiMix(message) {
    message = message.split(" ");
    message.shift()
    message = message.join(" ").replace(/\s+/ig, '');
    if (message.length === 0) return help;
    let emojis = message.split("+");
    let url = await emojimixer(emojis[0], emojis[1]);
    return [url.startsWith("[") ? url : segment.image(url)];
}

async function emojimixer(emoji1, emoji2) {
    const API = "https://www.gstatic.com/android/keyboard/emojikitchen/";
    let codes1 = emoji2codes(emoji1);
    let codes2 = emoji2codes(emoji2);
    let path1 = emojiDic[codes1.join("-")];
    let path2 = emojiDic[codes2.join("-")];
    if (!(path1 && path2)) return "[ERROR] 含有非法的字符或不支持的emoji表情！";
    let unicode1 = codes2unicode(codes1);
    let unicode2 = codes2unicode(codes2);
    let url1 = `${API}${path1}/${unicode1}/${unicode1}_${unicode2}.png`;
    let url2 = `${API}${path2}/${unicode2}/${unicode2}_${unicode1}.png`;

    return testUrl(url1, url2);

    async function testUrl(url1, url2) {
        try {
            await got(url1);
            return url1;
        } catch (error) {
            try {
                await got(url2);
                return url2;
            } catch (err) {
                return "[WARNING] 含有不支持的emoji表情或暂无这两种表情的融合结果！";
            }
        }
    };
}

function getHelp() {
    let emojis = [];
    for (const code of Object.keys(emojiDic)) {
        emojis.push(codes2emoji(code.split("-")));
    }
    return `
合成emoji~
<-emoji 😎+😁>
支持的emoji有：${emojis.join("，")}
    `.trim();
}

function codes2emoji(codes) {
    let emoji = "";
    codes.forEach(c => {
        emoji += String.fromCodePoint(Number(c));
    })
    return emoji;
}

function codes2unicode(codes) {
    let unicodeList = [];
    codes.forEach(c => {
        unicodeList.push(`u${Number(c).toString(16)}`);
    })
    return unicodeList.join("-");
}

function emoji2codes(emoji) {
    let codesList = [];
    for (const c of emoji) {
        codesList.push(c.codePointAt(0));
    }
    return codesList;
}

export { apply };