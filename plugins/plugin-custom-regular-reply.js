"use strict"
const fs = require("fs");
const path = require("path");
const { _readFileSync } = require("../lib/file");
const replyDir = path.join(__dirname, "../config-template/config");
const accountInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../account.json")));
const replyPath = replyDir + "/customRegReply.json";
const { getPermission } = require("../lib/permission");
//const { segment } = require("oicq");
const help_set = `
#set(regular)/#set(r)/#set(正则) [关键词]=[内容]
#set(pattern)/#set(p)/#set(模式) [关键词]=[匹配模式]
`.trim();
const help_del = `
#del(regular)/#del(r)/#del(正则) [关键词]
`.trim();
const help_dic = `
-调教字典(regular)/-调教字典(r)/-调教字典(正则)
查看自定义回复触发词列表
`.trim();

async function setRegReply(_bot, data, key, value) {
    if (!await getPermission(data, "自定义正则回复")) return; // 检测功能是否开启
    if (key.startsWith("[CQ:")) return; // CQ码开头的消息不触发功能

    // 检测权限
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    if (!((data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) !== -1) // 检测发消息者是不是超级用户
        || Number(accountInfo["owner"]) == data.user_id                                               // 检测发消息者是不是号主
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {                                    // 检测发消息者是不是管理
        data.reply("权限不足");
        return;
    }

    // help
    if ((key?.[0] === undefined || ["help", "帮助"].indexOf(key) !== -1) && value?.[0] === undefined) {
        data.reply(help_set);
        return;
    }

    // 添加失败
    if (key?.[0] === undefined && value?.[0] !== undefined) {
        data.reply("添加失败！请指定关键词");
        return;
    }
    if (value?.[0] === undefined) {
        data.reply("添加失败！请设置回复内容");
        return;
    }

    // 添加成功
    replyData[gid]["reply"][key] = value;
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("添加成功");
}
exports.setRegReply = setRegReply;

async function setRegPattern(_bot, data, key, value) {
    if (!await getPermission(data, "自定义正则回复")) return; // 检测功能是否开启
    if (key.startsWith("[CQ:")) return;

    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    if (!((data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) !== -1) // 检测发消息者是不是超级用户
        || Number(accountInfo["owner"]) == data.user_id                                               // 检测发消息者是不是号主
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {                                    // 检测发消息者是不是管理
        data.reply("权限不足");
        return;
    }

    // help
    if ((key?.[0] === undefined || ["help", "帮助"].indexOf(key) !== -1) && value?.[0] === undefined) {
        data.reply(help_set);
        return;
    }

    // 添加失败
    if (key?.[0] === undefined && value?.[0] !== undefined) {
        data.reply("添加失败！请指定关键词");
        return;
    }
    if (value?.[0] === undefined) {
        data.reply("添加失败！请设置匹配模式");
        return;
    }

    // 添加成功
    replyData[gid]["pattern"][key] = value;
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("添加成功");
}
exports.setRegPattern = setRegPattern;

async function deleteRegReply(_bot, data, args) {
    if (!await getPermission(data, "自定义正则回复")) return;

    // 检测权限
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    if (!((data.sender.role === "member" && replyData[gid]["SUPERUSER"].indexOf(data.user_id) !== -1)
        || Number(accountInfo["owner"]) == data.user_id
        || ["admin", "owner"].indexOf(data.sender.role) !== -1)) {
        data.reply("权限不足");
        return;
    }

    // help
    if (args?.length == 1 && (args?.[0] === undefined || ["help", "帮助"].indexOf(args?.[0]) !== -1)) {
        data.reply(help_del);
        return;
    } else if (args?.length === 0) {
        data.reply(help_del);
        console.log("Warning！参数长度不应该为0");
        return;
    }

    // 删除失败
    if (args.findIndex(elem => {return replyData[gid]["reply"][elem];}) == -1) {
        data.reply("删除失败！关键词不存在");
        return;
    }

    // 删除成功
    args.forEach(elem => {
        delete replyData[gid]["reply"][elem];
        delete replyData[gid]["pattern"][elem]; // pattern也要一并删
    });
    fs.writeFileSync(replyPath, JSON.stringify(replyData, null, '\t'));
    data.reply("删除成功");
}
exports.deleteRegReply = deleteRegReply;

async function customRegReply(_bot, data, args) {
    if (!await getPermission(data, "自定义正则回复")) return;
    const gid = String(data.group_id);
    let replyData = _readFileSync(replyDir, "customRegReply");
    let replyObj = replyData[gid]["reply"];
    //data.reply(replyObj?.[args]);

    _bot.getGroupMemberInfo(data.group_id, data.sender.user_id).then(res => { 
        // 判断是否是新人
        let join_time = new Date(res.data.join_time * 1e3);
        let time = Date.now() - join_time;
        let newTime = 3;// 判定为新人的时间，单位：天
        let isNew = ((time / 86400000 < newTime) || data.sender.level == 1)?true:false;
        let isOwner = data.user_id == accountInfo["owner"]?true:false;

        // 判断是否是机器人id
        let isID = (data.sender.user_id != 2987084315 && data.sender.user_id != 1354825038)?true:false;

        if ((isNew  && isID) || isOwner) {
            data.reply(replyObj?.[args]);
            // if (RegExp(/考核服/).test(data.message[0].data.text) == true) {
            //     data.reply("[CQ:at,qq=" + data.sender.user_id + "]" + "\n请阅读常见问题解答：https://wiki.npucraft.com/npucraftwiki/index.php/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E8%A7%A3%E7%AD%94");  
            // }
            // if (RegExp(/基岩版/).test(data.message[0].data.text) == true || RegExp(/手机/).test(data.message[0].data.text) == true && RegExp(/最新版手机QQ/).test(data.message[0].data.text) == false) {
            //     data.reply("[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器可以使用基岩版进服，群文件→基岩版（互通专供）安装包 可获取安装包。\n详请阅读：https://wiki.npucraft.com/npucraftwiki/index.php/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%BA%92%E9%80%9A");
            // }
            // if (RegExp(/java/i).test(data.message[0].data.text) == true) {
            //     data.reply("[CQ:at,qq=" + data.sender.user_id + "]" + "\nMC1.17之后必须安装Java1.16或更高版本，下载链接: https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/16/jre/x64/windows/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.msi");
            // }
            // if (RegExp(/(服).*(版本)/).test(data.message[0].data.text) == true) {
            //     data.reply("[CQ:at,qq=" + data.sender.user_id + "]" + "\n生存服版本1.17.1");
            // }
            // if (RegExp(/建筑服/).test(data.message[0].data.text) == true || RegExp(/复原/).test(data.message[0].data.text) == true) {
            //     data.reply("[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器建筑服目前正在社团内部进行删档测试。本校学生若想参与复原工程可联系群管理SUPER2FH。\n进入建筑服硬性要求：\n1.非观光摸鱼党；\n2.需要为西工大在校生或毕业生。");
            // }
        }
    })
}
exports.customRegReply = customRegReply;

// async function customRegReply(_bot, data, args) {
//     _bot.getGroupMemberInfo(data.group_id, data.sender.user_id).then(res => { 
//         // 判断是否是新人
//         let join_time = new Date(res.data.join_time * 1e3);
//         let time = Date.now() - join_time;
//         let newTime = 3;// 判定为新人的时间，单位：天
//         //console.log(time / 86400000);
//         let isNew = ((time / 86400000 < newTime) || data.sender.level == 1 || data.user_id == accountInfo["owner"])?true:false;

//         // 判断是否在指定群
//         //let isGroup = (data.group_id == 598445021 || data.group_id == 710085830 || data.group_id == 543559290)?true:false;
//         let isGroup = (data.group_id == 710085830)?true:false;
//         // 判断是否是机器人id
//         let isID = (data.sender.user_id != 2987084315 && data.sender.user_id != 1354825038)?true:false;
//         //console.log(isNew, isGroup, isID);

//         if (isNew && isGroup && isID) {
//             if (RegExp(/考核服/).test(data.message[0].data.text) == true) {
//                 _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n请阅读常见问题解答：https://wiki.npucraft.com/npucraftwiki/index.php/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E8%A7%A3%E7%AD%94");
//             }
//             if (RegExp(/基岩版/).test(data.message[0].data.text) == true || RegExp(/手机/).test(data.message[0].data.text) == true && RegExp(/最新版手机QQ/).test(data.message[0].data.text) == false) {
//                 _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器可以使用基岩版进服，群文件→基岩版（互通专供）安装包 可获取安装包。\n详请阅读：https://wiki.npucraft.com/npucraftwiki/index.php/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%BA%92%E9%80%9A");
//             }
//             if (RegExp(/java/i).test(data.message[0].data.text) == true) {
//                 _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\nMC1.17之后必须安装Java1.16或更高版本，下载链接: https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/16/jre/x64/windows/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.msi");
//             }
//             if (RegExp(/(服).*(版本)/).test(data.message[0].data.text) == true) {
//                 _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n生存服版本1.17.1");
//             }
//             if (RegExp(/建筑服/).test(data.message[0].data.text) == true || RegExp(/复原/).test(data.message[0].data.text) == true) {
//                 _bot.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器建筑服目前正在社团内部进行删档测试。本校学生若想参与复原工程可联系群管理SUPER2FH。\n进入建筑服硬性要求：\n1.非观光摸鱼党；\n2.需要为西工大在校生或毕业生。");
//             }
//         }
//     })
// }
// exports.customRegReply = customRegReply;

async function getRegReplyList(_bot, data, args = null) {
    if (!await getPermission(data, "自定义正则回复")) return;
    if (args?.length == 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help_dic);
        return;
    } else if (args?.length >= 1) {
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