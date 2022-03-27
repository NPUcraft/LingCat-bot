import { Data } from "./mcData.js";
import { segment } from "oicq";
import mc from "minecraft-protocol";

// 获取服务器信息
async function getServerInfo(host, port = 25565) {
    try {
        return await mc.ping({ host: host, port: port });
    } catch (error) {
        return "出错啦！";
    }
}

// 获取服务器玩家列表信息
async function getPlayerInfo(host, port = 25565) {
    let serverInfo = await getServerInfo(host, port);
    if (typeof serverInfo == "string") return null;
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


// 获取服务器图标
async function getServerFav(host, port = 25565) {
    let serverInfo = await getServerInfo(host, port);
    return serverInfo?.favicon;
}

// 获取服务器状态
async function getServerPing(group_id, host, port = 25565) {
    if (host === "") {
        let serverList = new Data().getServerList(group_id);
        let ip = serverList[0]?.ip?.split("|")?.[0];
        if (typeof ip === "undefined") return "服务器呢？";
        [host, port] = ip.split(":");
        if (typeof port === "undefined") port = 25565;
    } else {
        let serverList = new Data().getServerList(group_id).filter(server => server?.["uname"] == host);
        if (serverList.length !== 0) {
            let ip = serverList[0]?.["ip"]?.split("|")?.[0];;
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
            `服务器地址: ${serverAddress}\n`,
            `Ping: ${ping}ms`
        ];
    } else {
        fav = fav.split(",").slice(1).join(",");
        msg = [
            segment.image(Buffer.from(fav, "base64")),
            `服务器地址: ${serverAddress}\n`,
            `Ping: ${ping}ms`
        ];
    }
    return msg;
}

// 保存服务器信息
async function addServer(group_id, uname, host, port = 25565) {
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

// 删除服务器信息
async function removeServer(group_id, uname) {
    let serverList = new Data().getServerList(group_id)
        .filter(server => server?.["uname"] == uname.trim());
    if (serverList.length === 0) return "未查到该服务器";
    new Data().removeServer(uname, group_id);
    return "已删除该服务器！";
}

// 查看服务器列表
async function listServer(group_id) {
    let serverList = new Data().getServerList(group_id);
    let result;
    let serverTable = [];
    serverList.forEach(element => {
        serverTable.push(`[o] ${element["uname"]} (${element["ip"]?.split("|")[0]})`);
    });
    if (serverList.length !== 0) {
        result = `本群关注服务器列表如下：\n` + `${serverTable.join("\n")}`;
    } else {
        result = `本群关注服务器列表为空！`;
    }
    return result;
}

// 返回服务器玩家列表信息
async function getPlayersList(group_id) {
    let serverList = new Data().getServerList(group_id);
    let info = "";
    let ip = serverList[0]?.ip?.split("|")?.[0];
    if (typeof ip === "undefined") return "服务器呢？";
    let playerMax, playerOnline = 0;
    for (let cnt = 0; cnt < serverList[0]?.ip?.split("|")?.length; cnt++) {
        let _ip = serverList[0]?.ip?.split("|")[cnt];
        let [host, port] = _ip.split(":");
        let playersList = await getPlayerInfo(host, port);
        if (!playersList) continue;
        playerMax = playersList.max;
        if (typeof playersList?.sample === "string") continue;
        playerOnline += playersList?.sample.length;
        info += `\n${playersList?.sample.join(", ")}`;
    }
    if (info == "") info = "该服务器空荡荡~";
    let uname = serverList[0]?.uname;
    let msg = [
        `${uname}服务器在线玩家人数：${playerOnline}/${playerMax}`,
        info
    ];
    return msg;
}

export {
    listServer,
    getPlayersList,
    getServerPing,
    addServer,
    removeServer
}