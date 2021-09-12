const path = require("path");
const liveListDir = path.join(__dirname, "../../config-template/config");
const { _readFileSync } = require("../../lib/file");
const fs = require("fs");

class Data {

    constructor() {
        this._live_list = {};
        this.load()
    }

    load = () => {
        try {
            this._live_list = _readFileSync(liveListDir, "liveList");
        } catch (error) {
            console.log(error.message);
        }
    }

    dump = () => {
        _readFileSync(liveListDir, "liveList");  // 没有则创建配置文件
        fs.writeFileSync(liveListDir + "/liveList.json", JSON.stringify(this._live_list, null, '\t'));
    }

    getLiveList = (group_id = null) => {
        let liveList = this._live_list;
        const gid = String(group_id);
        let result = [];
        if (group_id) {
            if (typeof liveList?.[gid] === "undefined") liveList[gid] = [];
            result = liveList[gid];
        } else {
            result = liveList;
        }
        return result;
    }

    addLive = (live, group_id) => {
        const gid = String(group_id);
        let liveList = this.getLiveList(group_id);
        if (getFieldList(liveList, "uid").indexOf(live["uid"]) === -1) liveList.push(live);
        this._live_list[gid] = liveList;
        this.dump();
    }

    removeLive = (uname, group_id) => {
        const gid = String(group_id);
        let liveList = this.getLiveList(group_id).filter(live => live?.["uname"] !== uname);
        if (liveList) {
            this._live_list[gid] = liveList;
        } else {
            delete this._live_list[gid];
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