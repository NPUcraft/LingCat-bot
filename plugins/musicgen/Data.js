const path = require("path");
const musicListDir = path.join(__dirname, "../../config-template/config");
const { _readFileSync } = require("../../lib/file");
const fs = require("fs");

class Data {

    constructor() {
        this._music_list = {};
        this.load()
    }

    load = () => {
        try {
            this._music_list = _readFileSync(musicListDir, "musicList");
        } catch (error) {
            console.log(error.message);
        }
    }

    dump = () => {
        _readFileSync(musicListDir, "musicList");  // 没有则创建配置文件
        fs.writeFileSync(musicListDir + "/musicList.json", JSON.stringify(this._music_list, null, '\t'));
    }

    getMusicList = () => {
        let musicList = this._music_list;
        return musicList;
    }

    updateMusic = (uname = null, music = null) => {
        let musicList = this.getMusicList();
        if (typeof musicList[uname] === "undefined") musicList[uname] = music;
        this._music_list = musicList;
        this.dump();
    }

    getMusicName = () => {
        let musicList = this._music_list;
        return Object.keys(musicList);
    }

    getMusic = (uname = null) => {
        let musicList = this._music_list;
        return musicList[uname];
    }
}

exports.Data = Data;