const path = require("path");
const welcomeMsgDir = path.join(__dirname, "../../config-template/config");
const { _readFileSync } = require("../../lib/file");
const { cqcode } = require("oicq");
const fs = require("fs");

class Data {

    constructor() {
        this._welc_list = {};
        this.load()
    }

    load = () => {
        try {
            this._welc_list = _readFileSync(welcomeMsgDir, "welcomeMsg");
        } catch (error) {
            console.log(error.message);
        }
    }

    dump = () => {
        _readFileSync(welcomeMsgDir, "welcomeMsg");  // 没有则创建配置文件
        fs.writeFileSync(welcomeMsgDir + "/welcomeMsg.json", JSON.stringify(this._welc_list, null, '\t'));
    }

    getWelcomeList = () => {
        let welcomeList = this._welc_list;
        return welcomeList;
    }

    updateWelcome = (group_id = null, welcome = null) => {
        const gid = String(group_id);
        let welcomeList = this.getWelcomeList();
        if (typeof welcomeList[gid] === "undefined") welcomeList[gid] = welcome;
        this._welc_list = welcomeList;
        this.dump();
        return true;
    }

    getWelcome = (group_id = null, user_id = null) => {
        let welcomeList = this._welc_list;
        let rawMsg = welcomeList?.[String(group_id)];
        if (rawMsg == void 0) return rawMsg;
        return ((rawMsg + '').replace(/<at>/g, cqcode.at(user_id)));
    }
}

exports.Data = Data;