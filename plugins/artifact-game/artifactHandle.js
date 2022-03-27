const mainStatProbability = [
    {   // 生之花
        '生命值': 1
    },
    {   // 死之羽
        '攻击力': 1
    },
    {   // 时之沙
        '生命值%': 0.2668,
        '攻击力%': 0.2668,
        '元素充能效率%': 0.1,
        '元素精通': 0.1,
        '防御力%': 0.2688
    },
    {   // 空之杯
        '生命值%': 0.2125,
        '防御力%': 0.2,
        '元素精通': 0.025,
        '物理伤害加成%': 0.05,
        '火元素伤害加成%': 0.05,
        '雷元素伤害加成%': 0.05,
        '冰元素伤害加成%': 0.05,
        '水元素伤害加成%': 0.05,
        '风元素伤害加成%': 0.05,
        '岩元素伤害加成%': 0.05,
        '攻击力%': 0.2125
    },
    {   // 理之冠
        '生命值%': 0.22,
        '攻击力%': 0.22,
        '元素精通': 0.04,
        '暴击率%': 0.1,
        '暴击伤害%': 0.1,
        '治疗加成%': 0.1,
        '防御力%': 0.22
    }
];
const mainStat = {
    '生命值': [717, 4780],
    '攻击力': [47, 311],
    '生命值%': [7.0, 46.6],
    '攻击力%': [7.0, 46.6],
    '防御力%': [8.7, 58.3],
    '元素充能效率%': [8.7, 51.8],
    '元素精通': [28, 187],
    '暴击率%': [4.7, 31.1],
    '暴击伤害%': [9.4, 62.2],
    '治疗加成%': [5.4, 35.9],
    '物理伤害加成%': [8.7, 58.3],
    '火元素伤害加成%': [7.0, 46.6],
    '雷元素伤害加成%': [7.0, 46.6],
    '冰元素伤害加成%': [7.0, 46.6],
    '水元素伤害加成%': [7.0, 46.6],
    '风元素伤害加成%': [7.0, 46.6],
    '岩元素伤害加成%': [7.0, 46.6]
};
const artifactsTypes = ['生之花', '死之羽', '时之沙', '空之杯', '理之冠'];
const subStatProbability = {
    '生命值': {
        '生命值': 0,
        '攻击力': 0.1579,
        '生命值%': 0.15,
        '攻击力%': 0.15,
        '防御力%': 0.15,
        '元素充能效率%': 0.15,
        '元素精通': 0.15,
        '暴击率%': 0.1463,
        '暴击伤害%': 0.1463,
        '治疗加成%': 0.1364,
        '物理伤害加成%': 0.1364,
        '火元素伤害加成%': 0.1364,
        '雷元素伤害加成%': 0.1364,
        '冰元素伤害加成%': 0.1364,
        '水元素伤害加成%': 0.1364,
        '风元素伤害加成%': 0.1364,
        '岩元素伤害加成%': 0.1364
    },
    '攻击力': {
        '生命值': 0.1579,
        '攻击力': 0,
        '生命值%': 0.15,
        '攻击力%': 0.15,
        '防御力%': 0.15,
        '元素充能效率%': 0.15,
        '元素精通': 0.15,
        '暴击率%': 0.1463,
        '暴击伤害%': 0.1463,
        '治疗加成%': 0.1364,
        '物理伤害加成%': 0.1364,
        '火元素伤害加成%': 0.1364,
        '雷元素伤害加成%': 0.1364,
        '冰元素伤害加成%': 0.1364,
        '水元素伤害加成%': 0.1364,
        '风元素伤害加成%': 0.1364,
        '岩元素伤害加成%': 0.1364
    },
    '防御力': {
        '生命值': 0.1579,
        '攻击力': 0.1579,
        '生命值%': 0.15,
        '攻击力%': 0.15,
        '防御力%': 0.15,
        '元素充能效率%': 0.15,
        '元素精通': 0.15,
        '暴击率%': 0.1463,
        '暴击伤害%': 0.1463,
        '治疗加成%': 0.1364,
        '物理伤害加成%': 0.1364,
        '火元素伤害加成%': 0.1364,
        '雷元素伤害加成%': 0.1364,
        '冰元素伤害加成%': 0.1364,
        '水元素伤害加成%': 0.1364,
        '风元素伤害加成%': 0.1364,
        '岩元素伤害加成%': 0.1364
    },
    '生命值%': {
        '生命值': 0.1053,
        '攻击力': 0.1053,
        '生命值%': 0,
        '攻击力%': 0.1,
        '防御力%': 0.1,
        '元素充能效率%': 0.1,
        '元素精通': 0.1,
        '暴击率%': 0.0976,
        '暴击伤害%': 0.0976,
        '治疗加成%': 0.0909,
        '物理伤害加成%': 0.0909,
        '火元素伤害加成%': 0.0909,
        '雷元素伤害加成%': 0.0909,
        '冰元素伤害加成%': 0.0909,
        '水元素伤害加成%': 0.0909,
        '风元素伤害加成%': 0.0909,
        '岩元素伤害加成%': 0.0909
    },
    '攻击力%': {
        '生命值': 0.1053,
        '攻击力': 0.1053,
        '生命值%': 0.1,
        '攻击力%': 0,
        '防御力%': 0.1,
        '元素充能效率%': 0.1,
        '元素精通': 0.1,
        '暴击率%': 0.0976,
        '暴击伤害%': 0.0976,
        '治疗加成%': 0.0909,
        '物理伤害加成%': 0.0909,
        '火元素伤害加成%': 0.0909,
        '雷元素伤害加成%': 0.0909,
        '冰元素伤害加成%': 0.0909,
        '水元素伤害加成%': 0.0909,
        '风元素伤害加成%': 0.0909,
        '岩元素伤害加成%': 0.0909
    },
    '防御力%': {
        '生命值': 0.1053,
        '攻击力': 0.1053,
        '生命值%': 0.1,
        '攻击力%': 0.1,
        '防御力%': 0,
        '元素充能效率%': 0.1,
        '元素精通': 0.1,
        '暴击率%': 0.0976,
        '暴击伤害%': 0.0976,
        '治疗加成%': 0.0909,
        '物理伤害加成%': 0.0909,
        '火元素伤害加成%': 0.0909,
        '雷元素伤害加成%': 0.0909,
        '冰元素伤害加成%': 0.0909,
        '水元素伤害加成%': 0.0909,
        '风元素伤害加成%': 0.0909,
        '岩元素伤害加成%': 0.0909
    },
    '元素充能效率%': {
        '生命值': 0.1053,
        '攻击力': 0.1053,
        '生命值%': 0.1,
        '攻击力%': 0.1,
        '防御力%': 0.1,
        '元素充能效率%': 0,
        '元素精通': 0.1,
        '暴击率%': 0.0976,
        '暴击伤害%': 0.0976,
        '治疗加成%': 0.0909,
        '物理伤害加成%': 0.0909,
        '火元素伤害加成%': 0.0909,
        '雷元素伤害加成%': 0.0909,
        '冰元素伤害加成%': 0.0909,
        '水元素伤害加成%': 0.0909,
        '风元素伤害加成%': 0.0909,
        '岩元素伤害加成%': 0.0909
    },
    '元素精通': {
        '生命值': 0.1053,
        '攻击力': 0.1053,
        '生命值%': 0.1,
        '攻击力%': 0.1,
        '防御力%': 0.1,
        '元素充能效率%': 0.1,
        '元素精通': 0,
        '暴击率%': 0.0976,
        '暴击伤害%': 0.0976,
        '治疗加成%': 0.0909,
        '物理伤害加成%': 0.0909,
        '火元素伤害加成%': 0.0909,
        '雷元素伤害加成%': 0.0909,
        '冰元素伤害加成%': 0.0909,
        '水元素伤害加成%': 0.0909,
        '风元素伤害加成%': 0.0909,
        '岩元素伤害加成%': 0.0909
    },
    '暴击率%': {
        '生命值': 0.0789,
        '攻击力': 0.0789,
        '生命值%': 0.075,
        '攻击力%': 0.075,
        '防御力%': 0.075,
        '元素充能效率%': 0.075,
        '元素精通': 0.075,
        '暴击率%': 0,
        '暴击伤害%': 0.0732,
        '治疗加成%': 0.0682,
        '物理伤害加成%': 0.0682,
        '火元素伤害加成%': 0.0682,
        '雷元素伤害加成%': 0.0682,
        '冰元素伤害加成%': 0.0682,
        '水元素伤害加成%': 0.0682,
        '风元素伤害加成%': 0.0682,
        '岩元素伤害加成%': 0.0682
    },
    '暴击伤害%': {
        '生命值': 0.0789,
        '攻击力': 0.0789,
        '生命值%': 0.075,
        '攻击力%': 0.075,
        '防御力%': 0.075,
        '元素充能效率%': 0.075,
        '元素精通': 0.075,
        '暴击率%': 0.0732,
        '暴击伤害%': 0,
        '治疗加成%': 0.0682,
        '物理伤害加成%': 0.0682,
        '火元素伤害加成%': 0.0682,
        '雷元素伤害加成%': 0.0682,
        '冰元素伤害加成%': 0.0682,
        '水元素伤害加成%': 0.0682,
        '风元素伤害加成%': 0.0682,
        '岩元素伤害加成%': 0.0682
    }
};
const subStat = {
    '生命值': [209, 239, 269, 299],
    '攻击力': [14, 16, 18, 19],
    '防御力': [16, 19, 21, 23],
    '生命值%': [4.1, 4.7, 5.3, 5.8],
    '攻击力%': [4.1, 4.7, 5.3, 5.8],
    '防御力%': [5.1, 5.8, 6.6, 7.3],
    '元素充能效率%': [4.5, 5.2, 5.8, 6.5],
    '元素精通': [16, 19, 21, 23],
    '暴击率%': [2.7, 3.1, 3.5, 3.9],
    '暴击伤害%': [5.4, 6.2, 7, 7.8]
};

import { writeConfigSync, loadConfigAsJson } from "../../lib/file-system.js";

class Data {

    constructor() {
        this._artifact_list = {};
        this.load()
    }

    load() {
        this._artifact_list = loadConfigAsJson("artifactList.json");
        // 不存在则创建
        if (this._artifact_list == null) {
            writeConfigSync("artifactList.json", "{}")
            this._artifact_list = {};
        };
    }

    dump() {
        writeConfigSync("artifactList.json", JSON.stringify(this._artifact_list, null, '\t'), true);
    }

    getArtifactList(group_id = null) {
        let artifactList = this._artifact_list;
        return artifactList;
    }

    getArtifact(user_id = null, time = null, artifactId = null) {
        const uid = String(user_id);
        let artifactList = this.getArtifactList();
        if (typeof artifactList[uid] === "undefined")
            artifactList[uid] = {
                "level0": {
                    '0': {},
                    '1': {},
                    '2': {},
                    '3': {},
                    '4': {}
                },
                "level20": {
                    '0': {},
                    '1': {},
                    '2': {},
                    '3': {},
                    '4': {}
                },
                "time": 0
            };
        if (Math.abs(time - artifactList[uid]['time']) < 1 * 60 * 60) {
            return "一小时内仅能刷一次哦~";
        }
        let artifact = new Shua(artifactId).run();
        let typeId = String(artifactsTypes.indexOf(artifact.type));
        artifactList[uid]['level0'][typeId] = artifact;
        artifactList[uid]['time'] = time;
        this._artifact_list = artifactList;
        this.dump();
        return ("你的圣遗物：" + showArtifact(artifact));
    }

    viewArtifact(user_id = null, artifactId = null) {
        const uid = String(user_id);
        let artifactList = this.getArtifactList();
        if (typeof artifactList[uid] === "undefined") {
            return "你还没有任何圣遗物！";
        }
        let msg = "";
        if (artifactId == "all") {
            msg += `你的圣遗物：`;
            for (const a in artifactList[uid]["level0"]) {
                let atf = artifactList[uid]["level0"][a];
                if (Object.keys(atf).length === 0) continue;
                msg += `\n${atf['name']}(${atf['type']}) +${atf['level']}`;
            }
            for (const a in artifactList[uid]["level20"]) {
                let atf = artifactList[uid]["level20"][a];
                if (Object.keys(atf).length === 0) continue;
                msg += `\n${atf['name']}(${atf['type']}) +${atf['level']}`;
            }
        } else {
            msg += `你的${artifactsTypes[Number(artifactId)]}：`;
            msg += showArtifact(artifactList[uid]["level0"][artifactId]);
            msg += "\n" + showArtifact(artifactList[uid]["level20"][artifactId]);
        }
        return msg;
    }

    enhanceArtifact(user_id = null, artifactId = null) {
        const uid = String(user_id);
        let artifactList = this.getArtifactList();
        if (typeof artifactList[uid] === "undefined") {
            return "你还没有任何圣遗物！";
        }
        if (artifactId === "all") {
            return `强化莫心急 一个一个来吧`;
        }
        let msg = `强化${artifactsTypes[Number(artifactId)]}结果：`;
        if (Object.keys(artifactList[uid]["level0"][artifactId]).length === 0) {
            return `你没有可强化的${artifactsTypes[Number(artifactId)]}！`;
        }
        let artifact20 = enhanceArtifacts(artifactList[uid]["level0"][artifactId]);
        artifactList[uid]["level0"][artifactId] = {};
        artifactList[uid]["level20"][artifactId] = artifact20;
        this._artifact_list = artifactList;
        this.dump();
        msg += showArtifact(artifactList[uid]["level20"][artifactId]);
        return msg;
    }

}

export { Data };

/**
 * 返回圣遗物消息
 * @param {object} artifact 圣遗物数据
 * @returns 返回圣遗物消息
 */
function showArtifact(artifact) {
    if (Object.keys(artifact).length === 0) {
        return "";
    }
    let ret = `\n${artifact['name']}(${artifact['type']}) +${artifact['level']}\n(主)${artifact['mainStat']} +` + (artifact['level'] == 0 ? mainStat[artifact['mainStat']][0] : mainStat[artifact['mainStat']][1]);
    for (let s in artifact['subStat']) {
        ret += "\n" + s + " +" + artifact['subStat'][s];
    }
    return ret;
}

/**
 * 返回圣遗物数据
 * @param {list} name1 圣遗物名称1
 * @param {list} name2 圣遗物名称2
 * @returns 返回圣遗物
 */
function getArtifacts(name1, name2) {
    let s = generateArtifacts();
    let i = artifactsTypes.indexOf(s[0]);
    s.unshift((Math.random() > 0.5 ? name1 : name2)[i]);
    return { 'level': 0, 'name': s[0], 'type': s[1], 'mainStat': s[2], 'subStat': s[3] };
}

/**
 * 返回列表：[圣遗物类型，主词条（数值固定），副词条及数值]
 * @returns [string，string，object]
 */
function generateArtifacts() {
    let i = random(0, 5);
    let main = "";
    for (let m in mainStatProbability[i]) {
        main = m;
        if (mainStatProbability[i][m] >= Math.random())
            break;
    }
    let four = Math.random() > 0.8 ? 1 : 0;
    let sub = {};
    let _sub = "";
    while (1) {
        for (let s in subStatProbability) {
            if (subStatProbability[s][main] >= Math.random()) {
                _sub = s;
                break;
            }

        }
        if (_sub == "") continue;
        if (main === _sub) continue;
        if (sub[_sub]) continue;
        sub[_sub] = subStat[_sub][random(0, 4)];
        if (Object.keys(sub).length >= 3 + four) break;
    }
    return [artifactsTypes[i], main, sub];
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 返回强化后的圣遗物数据
 * @param {object} artifacts 圣遗物列表数据
 * @returns 强化后的圣遗物数据
 */
function enhanceArtifacts(artifacts) {
    if (artifacts['level'] === 20) {
        throw new Error("已满级，无法继续强化");
    }
    let selectedSubStat = artifacts['subStat'];
    let main = artifacts['mainStat'];
    let num = Object.keys(selectedSubStat).length == 3 ? 4 : 5;
    let sub = "";
    while (1) {
        if (Object.keys(selectedSubStat).length == 4) break;
        for (let s in subStatProbability) {
            if (subStatProbability[s][main] >= Math.random()) {
                sub = s;
                break;
            }

        }
        if (sub == "") continue;
        if (main === sub) continue;
        if (selectedSubStat[sub]) continue;
        selectedSubStat[sub] = subStat[sub][random(0, 4)];
    }
    let selectedSubStatList = Object.keys(selectedSubStat);
    for (let cnt = 0; cnt < num; cnt++) {
        let i = random(0, 4);
        selectedSubStat[selectedSubStatList[i]] = (Number)((Number)(selectedSubStat[selectedSubStatList[i]] + subStat[selectedSubStatList[i]][random(0, 4)]).toFixed(1));
    }
    artifacts['subStat'] = selectedSubStat;
    artifacts['level'] = 20;
    return artifacts;
}

/**
 * 返回具体副本的刷本消息
 * @returns 以下皆为各本的刷本入口
 */
class Shua {
    constructor(ben) {
        switch (ben) {
            case 'huo':
                this.name1 = ["魔女的炎之花", "魔女常燃之羽", "魔女破灭之时", "魔女的心之火", "焦灼的魔女帽"];
                this.name2 = ["渡火者的决绝", "渡火者的解脱", "渡火者的煎熬", "渡火者的醒悟", "渡火者的智慧"];
                break;
            case 'lei':
                this.name1 = ["雷鸟的怜悯", "雷灾的孑遗", "雷霆的时计", "降雷的凶兆", "唤雷的头冠"];
                this.name2 = ["平雷之心", "平雷之羽", "平雷之刻", "平雷之器", "平雷之冠"];
                break;
            case 'feng':
                this.name1 = ["野花记忆的绿野", "猎人青翠的箭羽", "翠绿猎人的笃定", "翠绿猎人的容器", "翠绿的猎人之冠"];
                this.name2 = ["远方的少女之心", "少女飘摇的思念", "少女苦短的良辰", "少女片刻的闲暇", "少女易逝的芳颜"];
                break;
            case 'yan':
                this.name1 = ["磐陀裂生之花", "嵯峨群峰之翼", "星罗圭璧之晷", "巉岩琢塑之樽", "不动玄石之相"];
                this.name2 = ["夏祭之花", "夏祭终末", "夏祭之刻", "夏祭水玉", "夏祭之面"];
                break;
            case 'bing':
                this.name1 = ["历经风雪的思念", "摧冰而行的执望", "冰雪故园的终期", "遍结寒霜的傲骨", "破冰踏雪的回音"];
                this.name2 = ["饰金胸花", "追忆之风", "坚铜罗盘", "沉波之盏", "酒渍船帽"];
                break;
            case 'zongShi':
                this.name1 = ["宗室之花", "宗室之翎", "宗室时计", "宗室银瓮", "宗室面具"];
                this.name2 = ["染血的铁之心", "染血的黑之羽", "骑士染血之时", "染血骑士之杯", "染血的铁假面"];
                break;
            case 'cangBai':
                this.name1 = ["无垢之花", "贤医之羽", "停摆之刻", "超越之盏", "嗤笑之面"];
                this.name2 = ["勋绩之花", "昭武翎羽", "金铜时晷", "盟誓金爵", "将帅兜鍪"];
                break;
            case 'huaGuanHaiRan':
                this.name1 = ["荣花之期", "华馆之羽", "众生之谣", "梦醒之瓢", "形骸之笠"];
                this.name2 = ["海染之花", "渊宫之羽", "离别之贝", "真珠之笼", "海祇之冠"];
                break;
            case 'zhuiYiJueYuan':
                this.name1 = ["羁缠之花", "思忆之矢", "朝露之时", "祈望之心", "无常之面"];
                this.name2 = ["明威之镡", "切落之羽", "雷云之笼", "绯花之壶", "华饰之兜"];
                break;
            default:
                break;
        }
    }

    run() {
        return getArtifacts(this.name1, this.name2)
    }
}