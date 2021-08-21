"use strict"
const { bot } = require("../../index");
const fs = require("fs");
const path = require("path");
const { segment } = require("oicq");

//自定义回复
let textjs = fs.readFileSync(path.join(__dirname, './text.json'), 'utf-8');
const text = JSON.parse(textjs);
var welc = text.welc;
var npu = text.npu;
var jv = text.jv;
var map = text.map;

/**
 * 自定义回复
 */
bot.on("message.group.normal", (data) => {
    switch (data.raw_message.toLowerCase()) {
        case 'jeff':
            var jeff = '[CQ:image,file=a893045c726957a48ba67e71b78a2b9633314-192-173.jpg,url=https://gchat.qpic.cn/gchatpic_new/1051487481/598445021-2301526193-A893045C726957A48BA67E71B78A2B96/0?term=3]'
            bot.sendGroupMsg(data.group_id, jeff);
            break;
        case "-help4":
            bot.sendGroupMsg(data.group_id,
                `1.欢迎新人
2.这是什么群
3.服务器官号
4.怎么下载JAVA
5.怎么截图
6.卫星地图
7.客户端异常退出怎么办
8.基岩版进服     `);
            break;
        case "欢迎新人":
            bot.sendGroupMsg(data.group_id, welc);
            break;
        case '服务器官号':
            var npuc = '现阶段我们在QQ与bilibili开设有官方宣传号' + "\n" + 'QQ：431167351(NPU-Minecraft)' + "\n" + 'B站：NPU-Minecraft' + "\n" + "服务器简介视频：https://b23.tv/2s9eiU";
            bot.sendGroupMsg(data.group_id, npuc);
            break;
        case "这是什么群":
            bot.sendGroupMsg(data.group_id, npu);
            break;
        case "怎么下载JAVA":
            bot.sendGroupMsg(data.group_id, jv);
            break;
        case "基岩版进服":
            var bedrock = 'NPUcraft通过Geyser插件实现JAVA-基岩版互通，群文件/基岩版（互通专供）安装包/内可获取相应版本'
            bot.sendGroupMsg(data.group_id, bedrock);
            break;
        case "怎么截图":
            var helps = `    请不要用手机对电脑屏幕拍照！

Minecraft游戏内截图键F2，图片保存在.minecraft→screenshots文件夹

win10系统全屏截图键prt screen，图片保存在剪切板中；alt+prt sc截图当前窗口，图片同保存在剪切板中；win+prt sc全屏截图，图片自动保存在此电脑→图片→屏幕截图文件夹

腾讯系应用(qq，微信)截图键ctrl+alt+a，可以手动框取指定大小的窗口截图，还能涂改编辑哟~，图片保存在剪切板中    `;
            bot.sendGroupMsg(data.group_id, helps);
            break;
        case "客户端异常退出怎么办":
            var v = `    客户端崩溃调试办法
1.首先检查内存分配有没有超，java路径对不对
2.独立显卡是英伟达的检查一下NVIDIA显卡设置里有没有将java.exe设置成使用高性能显卡启动(之后会出教程文档)
3.在hmcl启动器右下角先切换成原版启动;原版不能启动就删除.minecraft下的assets和libraries文件夹然后重试
4.在原版里创建单机存档看能不能打开
5.在原版里看看能不能登上服务器大厅
6.如果fabric版还是不能启动就重复步骤3
7.如果fabric版还是不行就一次禁用一两个mod，看看到底是禁用了哪个mod后能正常启动;或者一次只启用一两个，看看启用了哪个会崩(有些mod有依赖关系，之后会出说明文档)
8.用fabric版启动游戏后创建单机存档
9.用fabric版登录服务器
以上某一步出问题之后贴出崩溃报告/问题截图，并说明是哪一步，群友就可以更好的帮你解决问题鸭    `;
            bot.sendGroupMsg(data.group_id, v);
            break;
        case "卫星地图":
            data.reply(segment.share(map, 'NPUcraft卫星地图', "https://pic.imgdb.cn/item/611e2c9f4907e2d39c02aec7.png", 'NPUcraft卫星地图'))
            // bot.sendGroupMsg(data.group_id, map);
            break;
        case `群……`:
            bot.sendGroupMsg(data.group_id, '大吉猫咪');
            break;
    }
})