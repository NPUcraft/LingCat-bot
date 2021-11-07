"use strict"
const { getPermission } = require("../../lib/permission");
const parse = require("../../lib/parseArgs");
const { emptyDir } = require("../../lib/remove");
const { Data } = require("./Data");
const { segment } = require("oicq");
const qmidi = require("quick-midi");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");
let lastTime = Date.parse(new Date()) / 1000;
const cd = 10;
const help = `
[调教方法]
<-musicgen list>: 查看已保存的音乐
<-musicgen view 音乐名字>: 查看已保存的音乐乐谱
<-musicgen play 音乐名字>: 播放已保存的音乐
<-musicgen [Options] -- 乐谱>: 生成音乐,可选参数如下：
  -b, --bpm <正整数>: 音乐速度
  -s, --save <音乐名字> : 保存音乐

乐谱可有空格可换行
-musicgen后的--不可省略，其表示之后的所有内容为乐谱

具体记谱规则详见NPUcraftWiki-《音乐生成方法指南》页面
http://wiki.npucraft.top:8081/npucraftwiki/index.php/%E9%9F%B3%E4%B9%90%E7%94%9F%E6%88%90%E6%96%B9%E6%B3%95%E6%8C%87%E5%8D%97
`.trim();

async function musicgen(_bot, data, args = null) {
    if (!await getPermission(data, "musicgen")) return;
    if (data.time - lastTime - cd < 1e-5) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 1 && ["list", '列表'].indexOf(args?.[0]) !== -1) {
        let nameList = new Data().getMusicName();
        if (nameList.length === 0) data.reply("我的音乐书空空如也~");
        else data.reply(`音乐书曲目：[${nameList.join(" | ")}]`);
        return;
    } else if (args?.length === 2 && ["view", '查谱'].indexOf(args?.[0]) !== -1) {
        let musicData = new Data();
        let nameList = musicData.getMusicName();
        if (nameList.indexOf(args[1]) === -1) {
            data.reply("音乐本中暂无该曲目");
            return;
        }
        data.reply(musicData.getMusic(args[1]));
        return;
    } else if (args?.length === 2 && ["play", '播放'].indexOf(args?.[0]) !== -1) {
        let musicData = new Data();
        let nameList = musicData.getMusicName();
        if (nameList.indexOf(args[1]) === -1) {
            data.reply("窝不会唱~你教我呗");
            return;
        }
        let genRes = genMidi(musicData.getMusic(args[1]), String(data.time));
        if (!genRes.res) {
            data.reply(genRes.errMsg);
            return;
        }
        lastTime = data.time;// 成功调用则更新调用时间
        await sendMusic(data);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        return;
    }
    let opts = parse(args, {
        alias: { b: 'bpm', s: 'save' },
        default: { b: '120' },
        string: ['b', 's'],
        unknown: (err) => { return (`未知参数${err}`) }
    });
    if (typeof opts === "string") {
        data.reply(opts);
        return;
    }
    if (typeof opts?._ === void 0 || opts?._.length === 0) return;
    let input;  // 乐谱
    if (opts?._[0].endsWith(".mscg")) {    // 文件输入
        input = JSON.parse(fs.readFileSync(path.join(__dirname, "./musicgen.json")))?.[opts?._[0]];
    } else {
        input = opts._.join('');
    }
    let instrumentRes = Array.from(input.matchAll(/i{(.*?)}/g));
    let majorRes = Array.from(input.matchAll(/m{(.*?)}/g));
    const majorList = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'Cb', 'Db', 'Eb', 'F#', 'Gb', 'Ab', 'Bb'];
    instrumentRes.forEach(elem => {
        if (!Number.isInteger(Number(elem[1]))) {
            data.reply(`参数错误：音色参数i为整数,请查阅http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html#BMA1_4`);
            return;
        }
    });
    majorRes.forEach(elem => {
        if (majorList.indexOf(elem[1]) === -1) {
            data.reply(`参数错误：曲调参数-m为表中其一[C, D, E, F, G, A, B, C#, Cb, Db, Eb, F#, Gb, Ab, Bb]`);
            return;
        }
    })
    input = input.replace(/i{(.*?)}/g, `\\instrument{$1}`);
    input = input.replace(/m{(.*?)}/g, `\\major{$1}`);
    input = `\\bpm{${opts.bpm}}` + input;
    let genRes = genMidi(input, String(data.time));
    if (!genRes.res) {
        data.reply(genRes.errMsg);
        return;
    }
    lastTime = data.time;// 成功调用则更新调用时间
    if (opts?.save !== void 0 && typeof opts.save !== "boolean") {   // 保存
        let status = new Data().updateMusic(opts.save, input);
        if (status) data.reply("保存成功");
        else data.reply("保存失败，名字已存在");
        return;
    }
    await sendMusic(data);

}
exports.musicgen = musicgen;

function genMidi(input, name) {
    let info = { res: false, errMsg: null };
    let ctx = qmidi.createContext();
    let lines = input.split(/\n|\r\n|\r/);
    let midiFile;
    try {
        midiFile = ctx.parse(input);
    } catch (error) {
        info.errMsg = `Error: 乐谱错误\n错误标记：null`;
        return info;
    }
    let errors = ctx.getErrors();
    if (ctx.hasError()) {
        // for (let e of ctx.getPrintedErrors({ getLine: i => lines[i - 1] })) {
        //     console.log(e);
        // }
        info.errMsg = `Error: ${(errors[0]["msg"].startsWith("BPM") ||
            errors[0]["msg"].startsWith("Tempo")) ? "bpm参数非法或越界[4,16777215]" : "乐谱错误"}\n错误标记：${errors[0]["range"]["text"]}`;
        return info;
    }
    else {
        let midiData = qmidi.saveMidiFile(midiFile);
        if (!fs.existsSync(path.join(__dirname, './cache'))) fs.mkdirSync(path.join(__dirname, './cache'));
        fs.writeFileSync(path.join(__dirname, `./cache/${name}.mid`), Buffer.from(midiData))
        info.res = true;
        return info;
    }
}

async function sendMusic(data) {
    let ls = spawn('java', ['-jar', path.join(__dirname, "./midi2wav.jar"), path.join(__dirname, `./cache/${String(data.time)}.mid`), path.join(__dirname, "./cache/")]);
    ls.stdout.on('data', (data) => {
        // console.log(`stdout: ${data}`);
    });
    ls.stderr.on('data', (data) => {
        // console.error(`stderr: ${data}`);
    });
    ls.on('close', async (code) => {
        await data.reply([segment.record(path.join(__dirname, `./cache/${String(data.time)}.wav`))])
        let files = fs.readdirSync(path.join(__dirname, "./cache"));
        if (files.length > 40) {
            emptyDir(path.join(__dirname, "./cache"));
        }
    });
}

async function saveFile(_bot, data) {
    let msg = data.message[0];
    if (!(msg?.type === "file" && msg?.data?.name.endsWith(".mscg"))) return;
    if (!fs.existsSync(path.join(__dirname, './musicgen.json'))) {
        fs.writeFileSync(path.join(__dirname, "./musicgen.json"), JSON.stringify({}));
    }
    let musicData = JSON.parse(fs.readFileSync(path.join(__dirname, "./musicgen.json")));
    let url = msg?.data?.url;
    let fileName = msg?.data?.name;
    if (Object.keys(musicData).indexOf(fileName) !== -1) {
        data.reply("文件名重复，请改名后重新上传");
        return;
    }
    http.get(url, function (res) {  //发送get请求
        let html = ''
        res.on('data', function (data) {
            html += data  //字符串的拼接
        })
        res.on('end', function () {
            musicData[fileName] = html;
            fs.writeFileSync(
                path.join(__dirname, './musicgen.json'), JSON.stringify(musicData, null, '\t')
            );
        })
    }).on('error', function () {
        console.log('获取资源出错！')
    })
}
exports.saveFile = saveFile;