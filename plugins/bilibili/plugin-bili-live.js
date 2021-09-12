"use strict"
const { getPermission } = require("../../lib/permission");
const { Data } = require("./BiliLive");
const { segment } = require("oicq")
const { getLiveStatus, addLive, removeLive, listLive, getLiveInfo, getUpName } = require("./biliLiveHandle");
const help = `
<-bili 关注 [up猪uid]>: 关注up猪
<-bili 取关 [up猪昵称]>: 取关up猪
<-bili 查看 [up猪uid]>: 查看up直播状态
<-bili list>: 查看本群已关注的直播间
`.trim();

// 每两分钟检查一次直播状态
const getEveryLiveStatus = async (_bot) => {
    let data = new Data();
    let liveList = data.getLiveList();
    for (const id in liveList) {
        // 构造虚拟通知类数据 使得通过权限验证
        if (!await getPermission({ "group_id": id, "post_type": "notice" }, "直播间")) return;
        liveList[id].forEach(async (live) => {
            let uname = await getUpName(Number(live["uid"]));
            if (typeof uname === "undefined") return;
            let liveStatus = await getLiveInfo(Number(live["uid"]));
            if (typeof liveStatus === "undefined") return;
            let coverPic = liveStatus?.cover;
            let status = liveStatus?.liveStatus === 0 ? false : true;
            let liveTitle = liveStatus?.title;
            let url = liveStatus?.url;

            if (status !== live["status"]) {
                live["status"] = status;
                data.removeLive(uname, Number(id));
                data.addLive(live, Number(id));
                if (status === true) {
                    _bot.sendGroupMsg(Number(id), [
                        segment.image(coverPic),
                        segment.text(`${uname}正在直播《${liveTitle}》快来围观吧~\n围观地址：${url}`)
                    ])
                }
            }
        });
        // for (const live in liveList[id]) {

        // }
    }
}
exports.getEveryLiveStatus = getEveryLiveStatus;

async function biliLive(_bot, data, args = null) {
    if (!await getPermission(data, "直播间")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        return;
    } else if (args?.length === 2 && args?.[0] === "关注") {
        let msg = await addLive(data.group_id, args[1]);
        data.reply(msg);
        return;
    } else if (args?.length === 2 && args?.[0] === "取关") {
        let msg = await removeLive(data.group_id, args[1]);
        data.reply(msg);
        return;
    } else if (args?.length === 2 && args?.[0] === "查看") {
        let msg = await getLiveStatus(data.group_id, args[1]);
        data.reply(msg);
        return;
    } else if (args?.length === 1 && args?.[0] === "list") {
        let msg = await listLive(data.group_id);
        data.reply(msg);
        return;
    } else {
        return;
    }

}
exports.biliLive = biliLive;