console.log('plugin-dontstarve loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import seedRandom from "../../lib/seed-random.js";
import http from "http";
import cheerio from "cheerio";
import { segment } from "oicq";
import { writeFileSync, loadFileAsJson } from "../../lib/file-system.js";
import { getPermission } from "../../lib/permission.js";
import { parseArgs } from "../../lib/parse-args.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

let help;
function apply(hook) {
    hook('onCreate', function (bot) {
        /* Initialize */
        help = `
查看今日饥荒菜品
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
            e.data.reply(await getFood(e.data));
        }
    });
}

async function getFood(data) {
    let dontStarveFoodList = getDontStarveFoodList(); // 创建一个数组，用来保存资源
    const seedID = data.sender.user_id + new Date().toLocaleDateString();
    let foodItem = dontStarveFoodList[
        seedRandom.getRandomInt(seedID, 0, dontStarveFoodList.length)
    ];
    let card = data.sender.card;
    return [
        `${card === '' ? data.sender.nickname : card}，今天的菜品是${foodItem.name}`,
        segment.image(foodItem.image),
        `HP:${foodItem.HP}，HV:${foodItem.HV}，SAN:${foodItem.SAN}`
    ];
}

function getDontStarveFoodList() {
    let content = loadFileAsJson([__dirname, "foodlist.json"]);
    return content;
}

async function updateDontStarveFoodList() {
    const url = 'http://dontstarve.fandom.com/zh/wiki/%E9%A3%9F%E7%89%A9';
    let dontStarveFoodList = [] // 创建一个数组，用来保存资源
    http.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            let $ = cheerio.load(html);
            let foodTable = $('tr', '.wikitable.sortable');

            foodTable.each(function (item, index) {  //遍历html文档
                if (item > 0) {
                    let foodObj = $(this).children('td');
                    dontStarveFoodList.push({
                        name: foodObj.eq(1).children('a').text(),
                        image: foodObj.eq(0).find('img').attr('data-src'),
                        HP: foodObj.eq(3).text(),
                        HV: foodObj.eq(4).text(),
                        SAN: foodObj.eq(5).text(),
                    });
                }

            })
            writeFileSync("foodlist.json", JSON.stringify(dontStarveFoodList), true);
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

export { apply };