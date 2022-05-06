import log4js from "log4js";
import _ from "lodash";
import fs from "fs";
import path from "path";
import { loadFileAsJson, writeFileSync, writeConfigSync } from "./lib/file-system.js";
import { parseArgs } from "./lib/parse-args.js";
import { Hooks } from "./lib/hooks.js";
import { createClient } from "oicq";

const hookBus = new Hooks();
const botInfo = loadFileAsJson("data/account.json");
let botEnv = loadFileAsJson("data/bot-env.json");
const bot = createClient(botInfo.account, {
    platform: 5
})

// 日志记录配置
log4js.configure({
    appenders: {
        fileout: {
            type: 'dateFile',
            //文件名 = filename + pattern, 设置为alwaysIncludePattern：true
            filename: './logs/log',
            pattern: 'yyyy-MM-dd.log',
            // compress: true,
            //包含模型
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: { appenders: ["fileout"], level: "info" }
    }
});

bot.on("system.login.qrcode", function (e) {
    this.logger.mark("扫码后按Enter完成登录") //通过扫码二维码登录
    process.stdin.once("data", () => {
        this.login()
    })
}).on("system.login.error", function (e) {
    if (e.code < 0)
        this.login()
}).login()


/* =========== Plugins Load =========== */
bot.once("system.online", async function (e) {
    await loadPlugin(); // 加载插件 读取插件列表并更新bot环境中插件列表

    botEnv = loadFileAsJson("data/bot-env.json");
    // 初始化黑名单
    if (loadFileAsJson("data/config/blacklist.json") == null)
        writeConfigSync("blacklist.json", "[]");

    // 相关插件初始化
    onCreate(bot);
});


// 群消息处理
bot.on("message.group.normal", async function (e) {
    // 处理错误信息并汇报给主人
    await onMessage(e).catch(err => {
        this.logger.error(err);
        this.sendPrivateMsg(botInfo["owner"], err.message);
    })
})

// 私聊消息处理
bot.on("message.private", async function (e) {
    // 处理错误信息并汇报给主人
    await onMessage(e).catch(err => {
        this.logger.error(err);
        this.sendPrivateMsg(botInfo["owner"], err.message);
    })
})

// 群通知类插件
bot.on("notice.group", async function (e) {
    // 处理错误信息并汇报给主人
    await onNotice(e).catch(err => {
        this.logger.error(err);
        this.sendPrivateMsg(botInfo["owner"], err.message);
    })
})

function onCreate(bot) {
    hookBus.invoke('onCreate', bot);
}

async function onMessage(data) {
    let cmd = "";
    let rawArgs = "";
    let flag = "";
    let rawMsg = (data.raw_message + "").trim();
    if (botEnv.cmdFlag.indexOf(rawMsg[0]) !== -1 || botEnv.adminCmdFlag.indexOf(rawMsg[0]) !== -1) {
        flag = rawMsg.slice(0, 1);
        if (rawMsg.indexOf(" ") === -1) {
            cmd = rawMsg.slice(1);
        } else {
            cmd = rawMsg.slice(1, rawMsg.indexOf(" "));
            rawArgs = rawMsg.slice(rawMsg.indexOf(" ") + 1);
        }
    }
    let options = { "unknown": (err) => { return `未知参数${err}` } };
    for (const cmdd in botEnv.configPath) {
        if (cmdd.split("|").indexOf(cmd) !== -1) {
            options = loadFileAsJson(botEnv["configPath"][cmdd]).options;
            options["unknown"] = (err) => { return `未知参数${err}` };
            break;
        }
    }
    const args = parseArgs(rawArgs.split(" "), options);
    await hookBus.invokePromise('onMessage', { "bot": bot, "data": data, "flag": flag, "cmd": cmd, "rawArgs": rawArgs, "args": args })
        .catch(err => { throw err });
}

async function onNotice(data) {
    await hookBus.invokePromise('onNotice', { "bot": bot, "data": data })
        .catch(err => { throw err });
}

function hook(name, fn) {
    hookBus.add(name, fn);
}

async function loadPlugin() {
    let num = 0;
    let pluginsList = [];
    let cmdList = [];
    let configPath = [];
    let isOn = [];
    let plugins = fs.readdirSync(path.resolve('plugins'))
        .filter(p => !p.startsWith("_"));
    for (const plugin of plugins) {
        let pluginEntry = fs.readdirSync(path.resolve(`plugins/${plugin}`))
            .filter(item => /index.js/.test(item));
        if (pluginEntry.length == 0) {
            let subPluginEntry = fs.readdirSync(path.resolve(`plugins/${plugin}`))
                .filter(item => !(/config.json/.test(item)))
                .filter(item => !item.startsWith("_"));
            for (const sub of subPluginEntry) {
                cmdList.push(loadFileAsJson(`./plugins/${plugin}/${sub}/config.json`).cmd.join("|"));
                configPath.push(`./plugins/${plugin}/${sub}/config.json`);
                let p = await import(`./plugins/${plugin}/${sub}/index.js`);
                p.apply(hook);
            }
        } else {
            cmdList.push(loadFileAsJson(`./plugins/${plugin}/config.json`).cmd.join("|"));
            configPath.push(`./plugins/${plugin}/config.json`);
            let p = await import(`./plugins/${plugin}/${pluginEntry[0]}`);
            p.apply(hook);
        }
        num++;
        let cfg = loadFileAsJson(`plugins/${plugin}/config.json`);
        if (cfg !== null) {
            if (cfg?.pluginName !== "") pluginsList.push(cfg.pluginName)
            else pluginsList.push(plugin);
            isOn.push(cfg.default);
        }
    }
    console.log(`[INFO] 已成功加载${num}个插件`);
    botEnv["pluginsList"] = _.zipObject(pluginsList, isOn);
    botEnv["configPath"] = _.zipObject(cmdList, configPath);
    writeFileSync("data/bot-env.json", JSON.stringify(botEnv, null, '\t'), true);

}