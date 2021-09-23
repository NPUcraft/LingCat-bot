"use strict"
const { getPermission } = require("../../lib/permission");
const { spawn } = require("child_process");
const { segment } = require("oicq")
const fs = require("fs");
const path = require("path")
const help = `
分析群内聊天获取词云图
`.trim();


async function getWordCloud(_bot, data, args = null) {
    // if (!await getPermission(data, "wordCloud")) return;
    // if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
    //     data.reply(help);
    //     return;
    // } else if (args?.length > 1) {
    //     return;
    // }
    let ls = spawn('python', [path.join(__dirname, "./getWordCloud.py"), args[0]]);

    ls.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        // console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        const imagePath = path.join(__dirname, "./words.png");
        let imageData = fs.readFileSync(imagePath);
        let imageDataToBase64 = imageData.toString('base64');
        // data.reply([segment.image(Buffer.from(imageDataToBase64, "base64"))]);
    });
}
exports.getWordCloud = getWordCloud;

async function getMessage(_bot, data, args = null) {
    let texts = data.message.filter(msg => msg.type === 'text');
    let msg = "";
    texts.forEach(text => {
        msg += text?.data?.text;
    });
    if (msg === "") return;
    fs.writeFile(path.join(__dirname, `./record-${data.group_id}.txt`), `${msg}\n`, { flag: 'a+' }, err => { })
}
exports.getMessage = getMessage;