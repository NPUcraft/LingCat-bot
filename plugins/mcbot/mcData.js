const path = require("path");
const mcServerListDir = path.join(__dirname, "../../config-template/config");
const { _readFileSync } = require("../../lib/file");
const fs = require("fs");

class Data {

    constructor() {
        this._server_list = {};
        this.load()
    }

    load = () => {
        try {
            this._server_list = _readFileSync(mcServerListDir, "mcServerList");
        } catch (error) {
            console.log(error.message);
        }
    }

    dump = () => {
        _readFileSync(mcServerListDir, "mcServerList");  // 没有则创建配置文件
        fs.writeFileSync(mcServerListDir + "/mcServerList.json", JSON.stringify(this._server_list, null, '\t'));
    }

    getServerList = (group_id = null) => {
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

    addServer = (server, group_id) => {
        const gid = String(group_id);
        let serverList = this.getServerList(group_id);
        if (getFieldList(serverList, "ip").indexOf(server["ip"]) === -1) serverList.push(server);
        this._server_list[gid] = serverList;
        this.dump();
    }

    removeServer = (uname, group_id) => {
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

exports.Data = Data;

// 获取[{},{},{}...]中对象某一属性的值
function getFieldList(list, field) {
    let fieldList = [];
    list.forEach(elem => {
        fieldList.push(elem?.[field]);
    });
    return fieldList;
}