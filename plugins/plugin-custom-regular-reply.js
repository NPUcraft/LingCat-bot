"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const replyDir = path.join(__dirname, "../config-template/config");
const replyPath = replyDir + "/customRegReply.json";
const { getPermission } = require("../lib/permission");
//const { segment } = require("oicq");
const help = `
查看自定义正则回复触发词列表
`.trim();

async function setRegReply(_bot, data, key, value, pattern = null) {
    if (!await getPermission(data, "自定义正则回复")) return; // 检测功能是否开启
    if (value[1] == '') return;
    if (key.startsWith("[CQ:")) return;

    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    if (data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) === -1) {
        data.reply(`权限不足`);
        return;
    } // 检测发消息者是不是管理以及超级用户
    replyData[gid]["reply"][key] = value;
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("添加成功");
}
exports.setRegReply = setRegReply;

async function deleteRegReply(_bot, data, args) {
    if (!await getPermission(data, "自定义正则回复")) return;
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    if (data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) === -1) {
        data.reply(`权限不足`);
        return;
    }
    args.forEach(elem => {
        delete replyData[gid]["reply"][elem];
    });
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("删除成功");
}
exports.deleteRegReply = deleteRegReply;

// async function customRegReply(_bot, data, args) {
//     if (!await getPermission(data, "自定义正则回复")) return;
//     const gid = String(data.group_id);
//     let replyData = _readFileSync(replyDir, "customRegReply");
//     let replyObj = replyData[gid]["reply"];
//     data.reply(replyObj?.[args]);
// }
// exports.customRegReply = customRegReply;

async function getRegReplyList(_bot, data, args = null) {
    if (!await getPermission(data, "自定义正则回复")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length > 1) {
        return;
    }
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    let replyObj = replyData[gid]["reply"];
    let replyList = [];
    for (const key in replyObj) {
        replyList.push(key);
    }
    data.reply(`窝的小本本给你看看：\n[ ${replyList.join(" | ")} ]`);
}
exports.getRegReplyList = getRegReplyList;

async function customRegReply(_bot, data, args) {
    _bot.getGroupMemberInfo(data.group_id, data.sender.user_id).then(res => { 
        // 判断是否是新人
        let join_time = new Date(res.data.join_time * 1e3);
        let time = Date.now() - join_time;
        let newTime = 3;// 判定为新人的时间，单位：天
        //console.log(time / 86400000);
        let isNew = ((time / 86400000 < newTime) || data.sender.level == 1 || data.sender.user_id == 1368616836)?true:false;

        // 判断是否在指定群
        //let isGroup = (data.group_id == 598445021 || data.group_id == 710085830 || data.group_id == 543559290)?true:false;
        let isGroup = (data.group_id == 710085830)?true:false;
        // 判断是否是机器人id
        let isID = (data.sender.user_id != 2987084315 && data.sender.user_id != 1354825038)?true:false;
        //console.log(isNew, isGroup, isID);

        if (isNew && isGroup && isID) {
            if (RegExp(/考核服/).test(data.message[0].data.text) == true) {
                _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n请阅读新手安装图文教程来进入考核服：http://wiki.npucraft.top/npucraftwiki/index.php/NPUcraft%E6%96%B0%E6%89%8B%E5%AE%89%E8%A3%85%E5%9B%BE%E6%96%87%E6%95%99%E7%A8%8B");
            }
            if (RegExp(/基岩版/).test(data.message[0].data.text) == true || RegExp(/手机/).test(data.message[0].data.text) == true && RegExp(/最新版手机QQ/).test(data.message[0].data.text) == false) {
                _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器可以使用基岩版进服，群文件→基岩版（互通专供）安装包 可获取安装包。\n详请阅读：http://wiki.npucraft.top/npucraftwiki/index.php/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%BA%92%E9%80%9A");
            }
            if (RegExp(/java/i).test(data.message[0].data.text) == true) {
                _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\nMC1.17之后必须安装Java1.16或更高版本，下载链接: https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/16/jre/x64/windows/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.msi");
            }
            if (RegExp(/(服).*(版本)/).test(data.message[0].data.text) == true) {
                _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器生存服是1.17.1版本");
            }
            if (RegExp(/建筑服/).test(data.message[0].data.text) == true || RegExp(/复原/).test(data.message[0].data.text) == true) {
                _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器建筑服目前正在社团内部进行删档测试。本校学生若想参与复原工程可联系群管理SUPER2FH。\n进入建筑服硬性要求：\n1.非观光摸鱼党；\n2.需要为西工大在校生或毕业生。");
            }
        }
    })
}
exports.customRegReply = customRegReply;