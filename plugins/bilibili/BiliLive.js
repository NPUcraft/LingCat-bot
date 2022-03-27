import _ from "lodash";
import { writeConfigSync, loadConfigAsJson } from "../../lib/file-system.js";
import { GET } from "../../lib/http-utils.js";

class Data {

    constructor() {
        this._up_list = {};
        this.load()
    }

    load() {
        this._up_list = loadConfigAsJson("bilibiliUP.json");
        // 不存在则创建
        if (this._up_list == null) {
            writeConfigSync("bilibiliUP.json", "{}")
            this._up_list = {};
        };
    }

    dump() {
        writeConfigSync("bilibiliUP.json", JSON.stringify(this._up_list, null, '\t'), true);
    }

    getUpList(group_id = null) {
        let upList = this._up_list;
        const gid = String(group_id);
        let result = [];
        if (group_id) {
            if (upList?.[gid] == void 0) upList[gid] = [];
            result = upList[gid];
        } else {
            result = upList;
        }
        return result;
    }

    addUp(up, group_id) {
        const gid = String(group_id);
        let upList = this.getUpList(group_id);
        if (getFieldList(upList, "uid").indexOf(up["uid"]) === -1) upList.push(up);
        this._up_list[gid] = upList;
        this.dump();
    }

    removeUp(uid, group_id) {
        const gid = String(group_id);
        let upList = this.getUpList(group_id).filter(up => up?.["uid"] !== uid);
        if (upList) {
            this._up_list[gid] = upList;
        } else {
            delete this._up_list[gid];
        }

        this.dump();
    }
}

/**
 * 获取直播间信息
 * @param {number} uid up主uid
 * @returns 
 */
async function getLiveInfo(uid) {
    try {
        let liveInfo = await GET(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`);
        let live = liveInfo?.data?.data?.live_room;
        return typeof live == "undefined" ? null : live;
    } catch (error) {
        return null;
    }
}

/**
 * 获取up名称
 * @param {number} uid up主uid
 * @returns 
 */
async function getUpName(uid) {
    try {
        let upInfo = await GET(`http://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`);
        let upName = upInfo?.data?.data?.info?.uname;
        return typeof upName == "undefined" ? null : upName;
    } catch (error) {
        return null;
    }
}

/**
 * 获取up最新视频动态信息
 * @param {number} uid up主uid
 * @returns 
 */
async function getVideoDynamic(uid) {
    try {
        let dynamicInfo = await GET(`http://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}&offset_dynamic_id=0`);
        let videoDynamic = dynamicInfo?.data?.data?.cards
            .filter(i => i?.desc?.type == 8);
        return videoDynamic.length == 0 ? null : videoDynamic[0]["desc"];
    } catch (error) {
        return null;
    }
}


/**
 * 按关键字搜索哔站最相关的视频的bvid
 * @param {string} title 要搜索的关键词
 * @returns 
 */
async function searchVideo(title, moreSimilar = false) {
    try {
        let info = await GET(`http://api.bilibili.com/x/web-interface/search/all/v2?keyword=${title}`);
        let searchRes = info.data.data.result
            .filter(res => res.result_type == "video");
        searchRes = searchRes[0]["data"];
        if (moreSimilar)
            searchRes.sort((a, b) => similar(b.title.replace(/<[^<>]+>/g, ""), title) - similar(a.title.replace(/<[^<>]+>/g, ""), title));
        return searchRes.length == 0 ? null : searchRes[0]["bvid"];
    } catch (error) {
        return null;
    }
}

/**
 * 返回视频信息
 * @param {Number|String} vid aid|bvid
 * @returns 
 */
async function getVideoInfo(vid) {
    vid = String(vid);
    let type = Number.isNaN(Number(vid)) ? 'bvid' : 'aid';
    try {
        let info = await GET(`http://api.bilibili.com/x/web-interface/view?${type}=${vid}`);
        let videoInfo = info?.data?.data;
        return typeof videoInfo == "undefined" ? null : videoInfo;
    } catch (error) {
        return null;
    }
}

/**
 * 返回在线人数
 * @param {string} vid aid|bvid
 * @param {number} cid cid
 * @returns 
 */
async function getOnlineNumber(vid, cid) {
    vid = String(vid);
    let type = Number.isNaN(Number(vid)) ? 'bvid' : 'aid';
    try {
        let info = await GET(`http://api.bilibili.com/x/player/online/total?${type}=${vid}&cid=${cid}`);
        let videoInfo = info?.data?.data?.total;
        return typeof videoInfo == "undefined" ? null : videoInfo;
    } catch (error) {
        return null;
    }
}

export {
    Data,           // 记录群数据
    getLiveInfo,    // 获取直播间信息
    getUpName,      // 获取up名称
    getVideoDynamic,// 获取视频动态信息
    searchVideo,    // 按关键字搜索哔站第一个视频
    getVideoInfo,   // 获取指定bvid/aid视频信息
    getOnlineNumber,// 返回在线人数
};

// 获取[{},{},{}...]中对象某一属性的值
function getFieldList(list, field) {
    let fieldList = [];
    list.forEach(elem => {
        fieldList.push(elem?.[field]);
    });
    return fieldList;
}

// 字符串相似度函数
function similar(s, t, f) {
    if (!s || !t) {
        return 0;
    }
    let n = s.length
    let m = t.length
    let l = Math.max(m, n);

    let d = []
    f = f || 3
    let i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
        }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
}