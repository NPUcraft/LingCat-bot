const { Data } = require("./BiliLive");
const { segment } = require("oicq")
const axios = require('axios');
const header = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.84', 'cookie': "LIVE_BUVID=AUTO1016119148435822; CURRENT_FNVAL=80; _uuid=235C1EC1-0694-18FA-C4A1-AD20B7184C3F91431infoc; blackside_state=1; rpdid=|(u)YJRYY~Y|0J'uYuk||YYmY; buvid3=92F59451-12F7-4429-BFC2-2A71570ED78018545infoc; fingerprint3=8bba48ce6f136938017d87ba544925e9; buvid_fp=92F59451-12F7-4429-BFC2-2A71570ED78018545infoc; buvid_fp_plain=92F59451-12F7-4429-BFC2-2A71570ED78018545infoc; fingerprint_s=23c021f9d47287edc27c19167abc58f2; CURRENT_QUALITY=0; bp_t_offset_176811382=562047769775267263; fingerprint=3b85ddc703f5cc9adfaf50256355c9dc; SESSDATA=fb8c45cb%2C1645697316%2C0dc2b%2A81; bili_jct=854b51916a74badd32e303ddf81f6079; DedeUserID=176811382; DedeUserID__ckMd5=43a240fe1e78e93e; sid=ampos1hv; Hm_lvt_8a6e55dbd2870f0f5bc9194cddf32a02=1630218512; bp_video_offset_176811382=564607407071752577; PVID=2" };

// 获取直播间信息
const getLiveInfo = async (live_id) => {
    try {
        let liveInfo = await axios.get(`http://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=${live_id}`, {
            headers: header,
        })
        return liveInfo?.data?.data;
    } catch (error) {
        console.error(error)
    }
}
exports.getLiveInfo = getLiveInfo;

// 获取up昵称
const getUpName = async (live_id) => {
    try {
        let upInfo = await axios.get(`http://api.live.bilibili.com/live_user/v1/Master/info?uid=${live_id}`, {
            headers: header,
        })
        return upInfo?.data?.data?.info?.uname;
    } catch (error) {
        console.error(error)
    }
}
exports.getUpName = getUpName;

// 获取直播间状态
const getLiveStatus = async (group_id, live_id) => {
    let liveList = new Data().getLiveList(group_id).filter(live => live?.["uname"] == live_id);
    if (liveList.length !== 0) live_id = Number(liveList[0]?.["uid"]);
    let uname = await getUpName(live_id);
    if (typeof uname === "undefined") return;
    let liveStatus = await getLiveInfo(live_id);
    if (typeof liveStatus === "undefined") return "出错啦~";
    let coverPic = liveStatus?.cover;
    let status = liveStatus?.liveStatus === 0 ? false : true;
    let liveTitle = liveStatus?.title;
    let url = liveStatus?.url;
    let msg = [
        segment.image(coverPic),
        segment.text(`${uname}`),
        segment.text(`${status ? `正在直播《${liveTitle}》快来围观吧~\n围观地址：${url}` : `未直播~`} `)
    ];
    return msg;
}
exports.getLiveStatus = getLiveStatus;

// 保存直播间信息
const addLive = async (group_id, live_id) => {
    let uname = await getUpName(live_id);
    if (typeof uname === "undefined") return;
    let liveStatus = await getLiveInfo(live_id);
    if (typeof liveStatus === "undefined") return "出错啦~";
    let status = liveStatus?.liveStatus === 0 ? false : true;
    new Data().addLive({
        "uid": live_id,
        "uname": uname,
        "status": status,
    }, group_id);
    return `关注${uname}直播间成功！`;
}
exports.addLive = addLive;

// 删除直播间信息
const removeLive = async (group_id, uname) => {
    let liveList = new Data().getLiveList(group_id)
        .filter(live => live?.["uname"] == uname.trim() || live?.["uid"] == Number(uname));
    if (liveList.length === 0) return "未关注该直播间";
    new Data().removeLive(uname, group_id);
    return "已取关该直播间！";
}
exports.removeLive = removeLive;

// 查看直播间信息
const listLive = async (group_id) => {
    let liveList = new Data().getLiveList(group_id);
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
exports.listLive = listLive;