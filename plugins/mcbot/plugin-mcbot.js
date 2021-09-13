"use strict"
const { getPermission } = require("../../lib/permission");
const { listServer, getPlayersList, getServerPing, addServer, removeServer } = require("./mcHandle");
const help = `
<-mc list>: 查看本群关注的服务器
<-mc add name ip>: 添加服务器
<-mc remove name>: 移除服务器
<-mc ping>: ping一下默认服务器
<-mc ping ip/name>: ping一下指定服务器
<-mc online>: 查看默认服务器在线玩家列表
`.trim();

async function ping(_bot, data, args = null) {
    if (!await getPermission(data, "mc")) return;
    if (args?.length === 1 && ["help", '帮助'].indexOf(args?.[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args?.length === 0) {
        data.reply(help);
        return;
    } else if (args?.length === 1 && args?.[0] === "list") {
        let msg = await listServer(data.group_id);
        data.reply(msg);
        return;
    } else if (args?.length === 1 && args?.[0] === "online") {
        let msg = await getPlayersList(data.group_id);
        data.reply(msg);
        return;
    } else if (args?.length >= 1 && args?.[0] === "ping") {
        let msg = await getServerPing(data.group_id, args[1]);
        data.reply(msg);
        return;
    } else if (args?.length === 3 && args?.[0] === "add") {
        let msg = await addServer(data.group_id, args[1], args[2]);
        data.reply(msg);
        return;
    } else if (args?.length === 2 && args?.[0] === "remove") {
        let msg = await removeServer(data.group_id, args[1]);
        data.reply(msg);
        return;
    } else {
        return;
    }
}
exports.ping = ping;