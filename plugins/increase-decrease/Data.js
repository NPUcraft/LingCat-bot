import { writeConfigSync, loadConfigAsJson } from "../../lib/file-system.js";
import { segment } from "oicq";

class Data {

    constructor() {
        this._welc_list = {};
        this.load()
    }

    load() {
        this._welc_list = loadConfigAsJson("welcomeMsg.json");
        // 不存在则创建
        if (this._welc_list == null) {
            writeConfigSync("welcomeMsg.json", "{}")
            this._welc_list = {};
        };
    }

    dump() {
        writeConfigSync("welcomeMsg.json", JSON.stringify(this._welc_list, null, '\t'), true);
    }

    getWelcomeList() {
        let welcomeList = this._welc_list;
        return welcomeList;
    }

    updateWelcome(group_id = null, welcome = null) {
        const gid = String(group_id);
        let welcomeList = this.getWelcomeList();
        if (typeof welcomeList[gid] === "undefined") welcomeList[gid] = welcome;
        this._welc_list = welcomeList;
        this.dump();
        return true;
    }

    getWelcome(group_id = null, user_id = null) {
        let welcomeList = this._welc_list;
        let rawMsg = welcomeList?.[String(group_id)];
        if (rawMsg == void 0) return rawMsg;
        let msg = [];
        for (const m of rawMsg) {
            if (m.type === "text" && m.text.split("<at>").length == 2) {
                msg.push({ "type": "text", "text": m.text.split("<at>")[0] });
                msg.push({ "type": "at", "qq": user_id });
                msg.push({ "type": "text", "text": m.text.split("<at>")[1] });
            }
            else
                msg.push(m);
        }
        return buildSendableMsg(msg);
    }
}

export { Data };

// 构建可发送的消息列表
function buildSendableMsg(message) {
    let replyMsg = [];
    message.forEach(m => {
        if (m.type === 'text') {
            replyMsg.push(m?.text);
        } else if (m.type === 'face') {
            replyMsg.push(segment.face(m?.id));
        } else if (m.type === 'image') {
            replyMsg.push(segment.image(m?.url));
        } else if (m.type === 'at') {
            replyMsg.push(segment.at(m?.qq));
        } else {
        }
    });
    return replyMsg;
}