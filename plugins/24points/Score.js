const path = require("path");
const scoreListDir = path.join(__dirname, "../../config-template/config");
const { _readFileSync } = require("../../lib/file");
const fs = require("fs");

class Score {

    constructor() {
        this._score_list = {};
        this.load()
    }

    load = () => {
        try {
            this._score_list = _readFileSync(scoreListDir, "24pointScoreList");
        } catch (error) {
            console.log(error.message);
        }
    }

    dump = () => {
        _readFileSync(scoreListDir, "24pointScoreList");  // 没有则创建配置文件
        fs.writeFileSync(scoreListDir + "/24pointScoreList.json", JSON.stringify(this._score_list, null, '\t'));
    }

    getScoreList = () => {
        let scoreList = this._score_list;
        return scoreList;
    }

    updateScore = (user_id = null, uname = null, time = null) => {
        const uid = String(user_id);
        let scoreList = this.getScoreList();
        if (typeof scoreList[uid] === "undefined") scoreList[uid] = { "uname": "", "time": 0, "score": 0 };
        if (uname !== scoreList[uid]["uname"]) scoreList[uid]["uname"] = uname;
        scoreList[uid]["time"] += time;
        scoreList[uid]["score"] += 1;
        this._score_list = scoreList;
        this.dump();
    }

    updateName = (user_id = null, uname = null) => {
        const uid = String(user_id);
        let scoreList = this.getScoreList();
        if (typeof scoreList[uid] === "undefined") scoreList[uid] = { "uname": "", "time": 0, "score": 0 };
        if (uname !== scoreList[uid]["uname"]) scoreList[uid]["uname"] = uname;
        this._score_list = scoreList;
        this.dump();
    }
}

exports.Score = Score;