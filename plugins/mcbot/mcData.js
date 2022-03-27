import { loadConfigAsJson, writeConfigSync } from "../../lib/file-system.js";

class Data {

    constructor() {
        this._server_list = {};
        this.load()
    }

    load() {
        this._server_list = loadConfigAsJson("mcServerList.json");
        // 不存在则创建
        if (this._server_list == null) {
            writeConfigSync("mcServerList.json", "{}")
            this._server_list = {};
        };
    }

    dump() {
        writeConfigSync("mcServerList.json", JSON.stringify(this._server_list, null, '\t'), true);
    }

    getServerList(group_id = null) {
        let serverList = this._server_list;
        const gid = String(group_id);
        let result = [];
        if (group_id) {
            if (typeof serverList?.[gid] === "undefined") serverList[gid] = [];
            result = serverList[gid];
        } else {
            result = serverList;
        }
        return result;
    }

    addServer(server, group_id) {
        const gid = String(group_id);
        let serverList = this.getServerList(group_id);
        if (getFieldList(serverList, "ip").indexOf(server["ip"]) === -1) serverList.push(server);
        this._server_list[gid] = serverList;
        this.dump();
    }

    removeServer(uname, group_id) {
        const gid = String(group_id);
        let serverList = this.getServerList(group_id).filter(server => server?.["uname"] !== uname);
        if (serverList) {
            this._server_list[gid] = serverList;
        } else {
            delete this._server_list[gid];
        }

        this.dump();
    }
}

export { Data };

// 获取[{},{},{}...]中对象某一属性的值
function getFieldList(list, field) {
    let fieldList = [];
    list.forEach(elem => {
        fieldList.push(elem?.[field]);
    });
    return fieldList;
}