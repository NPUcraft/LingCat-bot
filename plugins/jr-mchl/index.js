console.log('plugin-jrmchl loaded');   // 提示已加载插件（非必要）

import _ from "lodash";
import https from "https";
import cheerio from "cheerio";
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
查看今日运势
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
            let time = new Date().toLocaleDateString();
            getMcAlmanac(m => {
                let goods = [];
                let bads = [];
                m[0].forEach(element => {
                    goods.push(`☆${element.title}: ${element.text}`)
                });
                m[1].forEach(element => {
                    bads.push(`☒ ${element.title}: ${element.text}`)
                });

                let msg = `今日运势（${time}）\n宜：\n` + goods.join("\n") + `\n\n忌：\n` + bads.join("\n");
                e.data.reply(msg);
            })
        }
    });
}

function getMcAlmanac(callback) {
    const url = 'https://www.mcmod.cn/tools/almanacs/';
    let goodList = [];
    let badList = [];
    https.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            let $ = cheerio.load(html);
            let good = $('.good').find($('.block'));
            good.each(function (item, index) {  //遍历html文档
                let content = $(this);
                goodList.push({
                    title: content.find('.title').text(),
                    text: content.find('.text').text(),
                })
            })
            let bad = $('.bad').find($('.block'));
            bad.each(function (item, index) {  //遍历html文档
                let content = $(this);
                badList.push({
                    title: content.find('.title').text(),
                    text: content.find('.text').text(),
                })
            })
            callback([goodList, badList]);
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}

export { apply };