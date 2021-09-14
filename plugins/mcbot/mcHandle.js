const { Data } = require("./mcData");
const { segment } = require("oicq");
const mc = require('minecraft-protocol');

// 获取服务器信息
const getServerInfo = async (host, port = 25565) => {
    try {
        return await mc.ping({ host: host, port: port });
    } catch (error) {
        return "出错啦！";
    }
}
exports.getServerInfo = getServerInfo;

// 获取服务器玩家列表信息
const getPlayerInfo = async (host, port = 25565) => {
    let serverInfo = await getServerInfo(host, port);
    let playerInfo = serverInfo?.players;
    let playerList = serverInfo?.players?.sample;
    let players = [];
    if (playerList?.length === 0) players = "暂无信息";
    else if (typeof playerList === "undefined") players = "该服务器空荡荡~";
    else playerList.forEach(player => {
        players.push(player?.name);
    });
    playerInfo["sample"] = players;
    return playerInfo;
}
exports.getPlayerInfo = getPlayerInfo;

// 获取服务器图标
const getServerFav = async (host, port = 25565) => {
    let serverInfo = await getServerInfo(host, port);
    return serverInfo?.favicon;
}
exports.getServerFav = getServerFav;

// 获取服务器状态
const getServerPing = async (group_id, host, port = 25565) => {
    if (typeof host === "undefined") {
        let serverList = new Data().getServerList(group_id);
        let ip = serverList[0]?.ip;
        if (typeof ip === "undefined") return;
        [host, port] = ip.split(":");
        if (typeof port === "undefined") port = 25565;
    } else {
        let serverList = new Data().getServerList(group_id).filter(server => server?.["uname"] == host);
        if (serverList.length !== 0) {
            let ip = serverList[0]?.["ip"];
            [host, port] = ip.split(":");
            if (typeof port === "undefined") port = 25565;
        } else {
            [host, port] = host.split(":");
            if (typeof port === "undefined") port = 25565;
        }
    }

    let serverInfo = await getServerInfo(host, port);
    if (typeof serverInfo === "string") return serverInfo;
    let serverAddress = `${host}:${port}`;
    let ping = serverInfo?.latency;
    let fav = serverInfo?.favicon;
    let msg;
    if (typeof fav === "undefined") {
        msg = [
            segment.text(`服务器地址: ${serverAddress}\n`),
            segment.text(`Ping: ${ping}ms`)
        ];
    } else {
        fav = fav.split(",").slice(1).join(",");
        msg = [
            segment.image(Buffer.from(fav, "base64")),
            segment.text(`服务器地址: ${serverAddress}\n`),
            segment.text(`Ping: ${ping}ms`)
        ];
    }
    return msg;
}
exports.getServerPing = getServerPing;

// 保存服务器信息
const addServer = async (group_id, uname, host, port = 25565) => {
    [host, port] = host.split(":");
    if (typeof port === "undefined") port = 25565;
    let serverInfo = await getServerInfo(host, port);
    if (typeof serverInfo === "string") return "服务器连接出错~";
    let address = `${host}:${port}`;
    new Data().addServer({
        "uname": uname,
        "ip": address,
    }, group_id);
    return `关注${uname}(${address})服务器成功！`;
}
exports.addServer = addServer;

// 删除服务器信息
const removeServer = async (group_id, uname) => {
    let serverList = new Data().getServerList(group_id)
        .filter(server => server?.["uname"] == uname.trim());
    if (serverList.length === 0) return "未查到该服务器";
    new Data().removeServer(uname, group_id);
    return "已删除该服务器！";
}
exports.removeServer = removeServer;

// 查看服务器列表
const listServer = async (group_id) => {
    let serverList = new Data().getServerList(group_id);
    let result;
    let serverTable = [];
    serverList.forEach(element => {
        serverTable.push(`[o] ${element["uname"]} (${element["ip"]})`);
    });
    if (serverList.length !== 0) {
        result = `本群关注服务器列表如下：\n` + `${serverTable.join("\n")}`;
    } else {
        result = `本群关注服务器列表为空！`;
    }
    return result;
}
exports.listServer = listServer;

// 返回服务器玩家列表信息
const getPlayersList = async (group_id) => {
    let serverList = new Data().getServerList(group_id);
    let ip = serverList[0]?.ip;
    let uname = serverList[0]?.uname;
    if (typeof ip === "undefined") return;
    let [host, port] = ip.split(":");
    let playersList = await getPlayerInfo(host, port);
    let info = `${typeof playersList?.sample === "string" ? playersList?.sample : playersList?.sample.join(", ")}`;
    let msg = [
        segment.text(`${uname}服务器在线玩家人数：${playersList.online}/${playersList.max}\n`),
        segment.text(info)
    ];
    return msg;
}
exports.getPlayersList = getPlayersList;