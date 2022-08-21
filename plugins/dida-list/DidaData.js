import _ from "lodash";
import { writeConfigSync, loadConfigAsJson } from "../../lib/file-system.js";

class Data {

    constructor() {
        this._dida_list = {};
        this.load()
    }

    load() {
        this._dida_list = loadConfigAsJson("dida_list.json");
        // 不存在则创建
        if (this._dida_list == null) {
            writeConfigSync("dida_list.json", "{}")
            this._dida_list = {};
        };
    }

    dump() {
        writeConfigSync("dida_list.json", JSON.stringify(this._dida_list, null, '\t'), true);
    }

    getDidaList(group_id = null) {
        let didaList = this._dida_list;
        const gid = String(group_id);
        let result = [];
        if (group_id) {
            if (didaList?.[gid] == void 0) didaList[gid] = {};
            result = didaList[gid];
        } else {
            result = didaList;
        }
        return result;
    }

    addDida(dida, group_id) {
        // dida => {"time":"0830","content":message,"rawMessage":""}
        const gid = String(group_id);
        let didaList = this.getDidaList(group_id);
        let id = getCurrentIdStr();
        if (Object.keys(didaList).indexOf(id) !== -1) id += new Date().getSeconds();
        didaList[`${id}`] = dida;
        this._dida_list[gid] = didaList;
        this.dump();
    }

    removeDida(didaid, group_id) {
        const gid = String(group_id);
        let didaList = this.getDidaList(group_id);
        delete didaList[didaid];
        if (didaList) {
            this._dida_list[gid] = didaList;
        } else {
            delete this._dida_list[gid];
        }

        this.dump();
    }
}

export {
    Data          // 记录群数据
};


function getCurrentIdStr() {
    return (PrefixInteger(new Date().getFullYear(), 2)
        + PrefixInteger(new Date().getMonth() + 1, 2) + PrefixInteger(new Date().getDate(), 2)
        + PrefixInteger(new Date().getHours(), 2) + PrefixInteger(new Date().getMinutes(), 2));
    function PrefixInteger(num, m) {
        return (Array(m).join(0) + num).slice(-m);
    }
}