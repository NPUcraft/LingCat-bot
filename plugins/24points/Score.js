import { loadFileAsJson, writeConfigSync } from "../../lib/file-system.js";

class Score {

    constructor() {
        this._score_list = {};
        this.load()
    }

    load() {
        this._score_list = loadFileAsJson("data/config/24pointScoreList.json");
        // 不存在则创建
        if (this._score_list == null) {
            writeConfigSync("24pointScoreList.json", "{}")
            this._score_list = {};
        };
    }

    dump() {
        writeConfigSync("24pointScoreList.json", JSON.stringify(this._score_list, null, '\t'), true);
    }

    getScoreList() {
        let scoreList = this._score_list;
        return scoreList;
    }

    updateScore(user_id = null, uname = null, time = null) {
        const uid = String(user_id);
        let scoreList = this.getScoreList();
        if (typeof scoreList[uid] === "undefined") scoreList[uid] = { "uname": "", "time": 0, "score": 0 };
        if (uname !== scoreList[uid]["uname"]) scoreList[uid]["uname"] = uname;
        scoreList[uid]["time"] += time;
        scoreList[uid]["score"] += 1;
        this._score_list = scoreList;
        this.dump();
    }

    updateName(user_id = null, uname = null) {
        const uid = String(user_id);
        let scoreList = this.getScoreList();
        if (typeof scoreList[uid] === "undefined") scoreList[uid] = { "uname": "", "time": 0, "score": 0 };
        if (uname !== scoreList[uid]["uname"]) scoreList[uid]["uname"] = uname;
        this._score_list = scoreList;
        this.dump();
    }
}

export { Score };