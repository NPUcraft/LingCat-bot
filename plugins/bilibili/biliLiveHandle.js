import { Data, getLiveInfo, getUpName, getVideoDynamic, searchVideo, getVideoInfo, getOnlineNumber } from "./BiliLive.js"
import { segment } from "oicq";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

// 获取直播间状态
async function getLiveStatus(group_id, live_id) {
    let liveList = new Data().getUpList(group_id).filter(live => live?.["uname"] == live_id);
    if (liveList.length !== 0) live_id = Number(liveList[0]?.["uid"]);
    let uname = await getUpName(live_id);
    let liveStatus = await getLiveInfo(live_id);
    if (!(uname && liveStatus)) return "出错啦~检查uid是否正确";
    let coverPic = liveStatus?.cover;
    let status = liveStatus?.liveStatus === 1 ? true : false;
    let liveTitle = liveStatus?.title;
    let url = liveStatus?.url;
    if (!(liveTitle && url)) return "出错啦~";
    let msg = [
        segment.image(coverPic),
        `${uname}`,
        `${status ? `正在直播《${liveTitle}》快来围观吧~\n围观地址：${url}` : `未直播~`} `
    ];
    return msg;
}


// 保存直播间信息
async function addLive(group_id, live_id) {
    let uname = await getUpName(live_id);
    let liveStatus = await getLiveInfo(live_id);
    if (liveStatus == null) return "该up没有开通直播间";
    if (!(uname && liveStatus)) return "出错啦~请输入uid关注up";
    let status = liveStatus?.liveStatus === 1 ? true : false;
    new Data().addUp({
        "uid": live_id,
        "uname": uname,
        "status": status,
    }, group_id);
    return `关注${uname}直播间成功！`;
}

// 删除直播间信息
async function removeLive(group_id, uname) {
    let liveList = new Data().getUpList(group_id)
        .filter(live => live?.["uname"] == uname.trim() || live?.["uid"] == Number(uname));
    if (liveList.length === 0) return "未关注该直播间";
    new Data().removeUp(liveList[0]["uid"], group_id);
    return `已取关${liveList[0]["uname"]}直播间！`;
}

// 查看直播间信息
async function listLive(group_id) {
    let liveList = new Data().getUpList(group_id);
    let result;
    let liveTable = [];
    liveList.forEach(element => {
        liveTable.push(`[${element.status ? 'o' : 'x'}] ${element["uname"]} (${element["uid"]})`);
    });
    if (liveList.length !== 0) {
        result = `本群关注直播间列表如下：\n` + `${liveTable.join("\n")}`;
    } else {
        result = `本群关注直播间列表为空！`;
    }
    return result;
}

// 解析分享的哔站视频
async function parseBiliShare(jsonData) {
    let title = jsonData?.["meta"]?.["detail_1"]?.["desc"];
    if (title == void 0) return "未知的b站视频";
    let searchBVID = await searchVideo(title, true);
    if (!searchBVID) return "未知的b站视频";
    let videoInfo = await getVideoInfo(searchBVID);
    return await buildBiliMsg(videoInfo);
}

async function viewVideo(id) {
    if (id.startsWith("BV")) {
        let videoInfo = await getVideoInfo(id);
        if (videoInfo) return await buildBiliMsg(videoInfo);
    }
    if (!Number.isNaN(Number(id))) {
        let videoInfo = await getVideoInfo(id);
        if (videoInfo) return await buildBiliMsg(videoInfo);
    }
    let searchBVID = await searchVideo(id);
    if (!searchBVID) return "未知的b站视频";
    let videoInfo = await getVideoInfo(searchBVID);
    return await buildBiliMsg(videoInfo);
}

// 构件解析后的视频信息
async function buildBiliMsg(videoInfo) {
    let pic = videoInfo.pic;
    let title = `\n《${videoInfo.title}》(${formateTime(videoInfo.duration)})`;
    let bvid = `\nBV号：${videoInfo.bvid}`;
    let stat = `\n播放/弹幕: ${videoInfo.stat.view} / ${videoInfo.stat.danmaku}`;
    let sanlian = `\n三连数: ${videoInfo.stat.like} / ${videoInfo.stat.coin} / ${videoInfo.stat.favorite}`;
    let online = await getOnlineNumber(videoInfo.bvid, videoInfo.cid);
    online = (online == null) ? "" : `\n正在观看: ${online}`;
    return [segment.image(pic), title, bvid, online, stat, sanlian];
}

function formateTime(time) {
    const h = parseInt(time / 3600)
    const minute = parseInt(time / 60 % 60)
    const second = Math.ceil(time % 60)

    const hours = h < 10 ? '0' + h : h
    const formatSecond = second > 59 ? 59 : second
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
}

// 每两分钟检查一次直播状态
const getEveryLiveStatus = async (bot) => {
    let data = new Data();
    let liveList = data.getUpList();
    for (const id in liveList) {
        let g = bot.pickGroup(Number(id));
        // 构造虚拟通知类数据 使得通过权限验证
        if (!getPermission({ "group_id": id, "post_type": "notice", "notice_type": "group", "group": { "mute_left": g.mute_left } }, __dirname)) return;
        liveList[id].forEach(async (live) => {
            let uname = await getUpName(Number(live["uid"]));
            let liveStatus = await getLiveInfo(Number(live["uid"]));
            if (!(uname && liveStatus)) return;
            let coverPic = liveStatus?.cover;
            let status = liveStatus?.liveStatus === 1 ? true : false;
            let liveTitle = liveStatus?.title;
            let url = liveStatus?.url;
            if (!(liveTitle && url)) return;
            if (status !== live["status"]) {
                live["status"] = status;
                data.removeUp(Number(live["uid"]), Number(id));
                data.addUp(live, Number(id));
                if (status === true) {
                    await bot.sendGroupMsg(Number(id), [
                        segment.image(coverPic),
                        `${uname}正在直播《${liveTitle}》快来围观吧~\n围观地址：${url}`
                    ])
                }
            }
        });
    }
}

export {
    getLiveStatus,      // 
    addLive,
    removeLive,
    listLive,
    parseBiliShare,
    viewVideo,
    getEveryLiveStatus
}