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
    switch (data.message[0].data.text.toLowerCase()) {
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
    }
})

// 临时添加的回复功能
bot.on("message.group.normal", (data) => {
    bot.getGroupMemberInfo(data.group_id, data.sender.user_id).then(res => { 
        // 判断是否是新人
        let join_time = new Date(res.data.join_time * 1e3);
        let time = Date.now() - join_time;
        let newTime = 10;// 判定为新人的时间，单位：天
        //console.log(time / 86400000);
        let isNew = ((time / 86400000 < newTime) || data.sender.level == 1 || data.sender.user_id == 1368616836)?true:false;

        // 判断是否在指定群
        let isGroup = (data.group_id == 598445021 || data.group_id == 710085830)?true:false;
        // 判断是否是机器人id
        let isID = (data.sender.user_id != 2987084315 && data.sender.user_id != 1354825038)?true:false;
        //console.log(isNew, isGroup, isID);

        if (isNew && isGroup && isID) {
            if (RegExp(/考核服/).test(data.message[0].data.text) == true) {
                bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n请阅读新手安装图文教程来进入考核服：http://wiki.npucraft.top/npucraftwiki/index.php/NPUcraft%E6%96%B0%E6%89%8B%E5%AE%89%E8%A3%85%E5%9B%BE%E6%96%87%E6%95%99%E7%A8%8B");
            }
            if (RegExp(/基岩版/).test(data.message[0].data.text) == true || RegExp(/手机/).test(data.message[0].data.text) == true) {
                bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器可以使用基岩版进服，群文件→基岩版（互通专供）安装包 可获取安装包。\n详请阅读：http://wiki.npucraft.top/npucraftwiki/index.php/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%BA%92%E9%80%9A");
            }
            if (RegExp(/java/i).test(data.message[0].data.text) == true) {
                bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\nMC1.17之后必须安装Java1.16或更高版本，下载链接: https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/16/jre/x64/windows/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.msi");
            }
            if (RegExp(/(服).*(版本)/).test(data.message[0].data.text) == true) {
                bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器生存服是1.17.1版本");
            }
            if (RegExp(/建筑服/).test(data.message[0].data.text) == true || RegExp(/复原/).test(data.message[0].data.text) == true) {
                bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器建筑服目前正在社团内部进行删档测试。本校学生若想参与复原工程可联系群管理SUPER2FH。\n进入建筑服硬性要求：\n1.非观光摸鱼党；\n2.需要为西工大在校生或毕业生。");
            }
        }
    })
})