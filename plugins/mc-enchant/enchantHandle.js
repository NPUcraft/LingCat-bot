import _ from "lodash";
const bookshelfNum = 15;
const numberTrans = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];
const enchantabilityList = {
    "木": [0, 15, 15],
    "皮革": [15, 0, 15],
    "石": [0, 5, 15],
    "铁": [9, 14, 15],
    "锁链": [12, 0, 15],
    "钻石": [10, 10, 15],
    "金": [25, 22, 15],
    "下界合金": [15, 15, 15],
    "海龟壳": [9, 0, 15],
    "书": [1, 1, 1],
    "弓": [10, 10, 10],
    "钓鱼竿": [5, 5, 5],
    "三叉戟": [8, 8, 8]
};
const enchantmentLevelList = {
    "盔甲": {
        "保护": [[1, 21], [12, 32], [23, 43], [34, 54], [NaN, NaN]],
        "火焰保护": [[10, 22], [18, 30], [26, 38], [34, 46], [NaN, NaN]],
        "摔落保护": [[5, 15], [11, 21], [17, 27], [23, 33], [NaN, NaN]],
        "爆炸保护": [[5, 17], [13, 25], [21, 33], [29, 41], [NaN, NaN]],
        "弹射物保护": [[3, 18], [9, 24], [15, 30], [21, 36], [NaN, NaN]],
        "水下呼吸": [[10, 40], [20, 50], [30, 60], [NaN, NaN], [NaN, NaN]],
        "水下速掘": [[1, 41], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "荆棘": [[10, 60], [30, 80], [50, 100], [NaN, NaN], [NaN, NaN]],
        "深海探索者": [[10, 25], [20, 35], [30, 45], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    },
    "剑": {
        "锋利": [[1, 21], [12, 32], [23, 43], [34, 54], [45, 65]],
        "亡灵杀手": [[5, 25], [13, 33], [21, 41], [29, 49], [37, 57]],
        "节肢杀手": [[5, 25], [13, 33], [21, 41], [29, 49], [37, 57]],
        "击退": [[5, 55], [25, 75], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "火焰附加": [[10, 60], [30, 80], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "抢夺": [[15, 65], [24, 74], [33, 83], [NaN, NaN], [NaN, NaN]],
        "横扫之刃": [[5, 20], [14, 29], [23, 38], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    },
    "弓": {
        "力量": [[1, 16], [11, 26], [21, 36], [31, 46], [41, 56]],
        "冲击": [[12, 37], [32, 57], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "火矢": [[20, 50], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "无限": [[20, 50], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    },
    "工具": {
        "效率": [[1, 51], [11, 61], [21, 71], [31, 81], [41, 91]],
        "精准采集": [[15, 65], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "时运": [[15, 65], [24, 74], [33, 83], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    },
    "钓鱼竿": {
        "海之眷顾": [[15, 65], [24, 74], [33, 83], [NaN, NaN], [NaN, NaN]],
        "饵钓": [[15, 65], [24, 74], [33, 83], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    },
    "三叉戟": {
        "引雷": [[25, 50], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN]],
        "穿刺": [[1, 21], [9, 29], [17, 37], [25, 45], [33, 53]],
        "忠诚": [[17, 40], [22, 45], [27, 50], [NaN, NaN], [NaN, NaN]],
        "激流": [[17, 30], [27, 40], [37, 50], [NaN, NaN], [NaN, NaN]],
        "耐久": [[5, 55], [13, 63], [21, 71], [NaN, NaN], [NaN, NaN]]
    }
};
const enchantWeightList = {
    "保护": 10,
    "火焰保护": 5,
    "摔落保护": 5,
    "爆炸保护": 2,
    "弹射物保护": 5,
    "水下呼吸": 2,
    "水下速掘": 2,
    "荆棘": 1,
    "深海探索者": 2,
    "耐久": 5,
    "锋利": 10,
    "亡灵杀手": 5,
    "节肢杀手": 5,
    "击退": 5,
    "火焰附加": 2,
    "抢夺": 2,
    "横扫之刃": 2,
    "力量": 10,
    "冲击": 2,
    "火矢": 2,
    "无限": 1,
    "效率": 10,
    "精准采集": 1,
    "时运": 2,
    "海之眷顾": 2,
    "饵钓": 2,
    "引雷": 1,
    "穿刺": 2,
    "忠诚": 5,
    "激流": 2
}
const conflictEnchantments = [
    ["保护", "火焰保护", "弹射物保护", "爆炸保护"],
    ["锋利", "亡灵杀手", "节肢杀手"],
    ["精准采集", "时运"],
    ["深海探索者", "冰霜行者"],
    ["经验修补", "无限"],
    ["引雷", "激流"],
    ["忠诚", "激流"],
    ["多重射击", "穿透"],
    // 以下是自我冲突
    ["摔落保护"],
    ["水下呼吸"],
    ["水下速掘"],
    ["荆棘"],
    ["耐久"],
    ["击退"],
    ["火焰附加"],
    ["抢夺"],
    ["横扫之刃"],
    ["力量"],
    ["冲击"],
    ["火矢"],
    ["效率"],
    ["海之眷顾"],
    ["饵钓"],
    ["穿刺"]
];
const itemConflictEnchantments = {
    "胸甲": ["深海探索者", "水下速掘", "水下呼吸", "摔落保护"],
    "外套": ["深海探索者", "水下速掘", "水下呼吸", "摔落保护"],
    "头盔": ["深海探索者", "摔落保护"],
    "帽子": ["深海探索者", "摔落保护"],
    "海龟壳": ["深海探索者", "摔落保护"],
    "护腿": ["深海探索者", "水下速掘", "水下呼吸", "摔落保护"],
    "裤子": ["深海探索者", "水下速掘", "水下呼吸", "摔落保护"],
    "靴子": ["水下速掘", "水下呼吸"]
}

/**
 * 魔咒选择step1: 附魔等级加入调节值
 * @param {string} 材料["木","皮革","石","铁","链","钻石","金","下界合金","海龟壳","书"]
 * @param {number} type 0 -> 盔甲   1 -> 剑/工具  2 -> 其他(弓钓竿三叉戟)
 * @param {number} choice 0 -> 第一行   1 -> 第二行  2 -> 第三行
 * @returns 等级调节值
 */
function getLevel(material, type, choice) {
    let enchantability = enchantabilityList[material][type];
    // 按三角分布生成一个调整附魔等级的随机数
    let randEnchantability = 1 + randomInt(0, enchantability / 4 + 1) + randomInt(0, enchantability / 4 + 1);
    // 调整附魔等级
    let k = chosenEnchantmentLevel()[choice] + randEnchantability;
    // 进行15%上(下)调整附魔奖励
    let randBonusPercent = (randomFloat() + randomFloat() - 1) * 0.15 + 1;
    // 最终等级调节值
    let finalLevel = round(k * randBonusPercent);
    return finalLevel < 1 ? 1 : finalLevel;
}


/**
 * 魔咒选择step2: 寻找可能的魔咒
 * @param {number} level 等级调节值
 * @param {string} type ["盔甲","剑","工具","弓","钓鱼竿","三叉戟"]
 * @returns 可附魔列表
 */
function getPossibleEnchantments(level, type) {
    let possibleEnchantmentsList = {};
    for (const enchantment in enchantmentLevelList[type]) {
        for (let cnt = 4; cnt >= 0; cnt--) {
            let levelTable = enchantmentLevelList[type][enchantment][cnt];
            if (Number.isNaN(levelTable[0])) continue;
            // 选中则添加至可能的魔咒表中
            if (levelTable[0] <= level && levelTable[1] >= level) {
                possibleEnchantmentsList[`${enchantment}`] = `${numberTrans[cnt]}`;
                break;
            }
        }
    }
    return possibleEnchantmentsList;
}

// 魔咒选择step3: 附魔
function enchant(something, choice) {
    let { material, type, typeId, item } = parseItem(something);
    if (typeId == -1) return "这个物品不可以附魔哦~";
    let level = getLevel(material, typeId, choice);
    let possibleEnchantmentsList = getPossibleEnchantments(level, type);
    let enchantmentsList = Object.keys(possibleEnchantmentsList);
    // 去除不合符物品的魔咒
    _.pullAll(enchantmentsList, itemConflictEnchantments[item]);

    let enchantmentsResult = {};

    while (true) {
        let pickWeight = [];
        enchantmentsList.forEach(enchantment => {
            pickWeight.push(enchantWeightList[enchantment]);
        });
        let enchantment = pick(enchantmentsList, pickWeight);
        enchantmentsResult[`${enchantment}`] = possibleEnchantmentsList[enchantment];

        // 判断是否得到更多附魔
        if (enchantmentsList.length == 0) break;
        level = round(level / 2);
        if ((level + 1) / 50 * 2 < Math.random()) break;

        // 继续附魔则删除相冲魔咒
        conflictEnchantments.forEach(c => {
            if (c.indexOf(enchantment) !== -1) {
                _.pullAll(enchantmentsList, c);
            }
        })
        if (enchantmentsList.length == 0) break;
    }

    return enchantmentsResult;
}
export { enchant };

// 解析物品名=材料+物品+物品分类编号
function parseItem(item) {
    let material, type, typeId, iitem;
    const armorMaterial = new Set(["金", "铁", "钻石", "下界合金", "锁链"]);
    const armorType = new Set(["胸甲", "头盔", "护腿", "靴子"]);
    const armorMaterial2 = new Set(["皮革"]);
    const armorType2 = new Set(["外套", "帽子", "裤子", "靴子"]);
    const swordToolMaterial = new Set(["木", "金", "石", "铁", "钻石", "下界合金"]);
    const swordToolType = new Set(["剑", "斧", "镐", "锹", "锄"]);
    const otherMaterial = ["海龟壳", "弓", "钓鱼竿", "三叉戟"];

    let words;
    if ((words = split(item, armorMaterial, armorType)) && words.length == 2) {
        // 是否为盔甲
        material = words[0];
        iitem = words[1];
        type = "盔甲";
        typeId = 0;
    } else if ((words = split(item, armorMaterial2, armorType2)) && words.length == 2) {
        // 是否为皮革制盔甲
        material = words[0];
        iitem = words[1];
        type = "盔甲";
        typeId = 0;
    } else if ((words = split(item, swordToolMaterial, swordToolType)) && words.length == 2) {
        // 是否为工具或剑
        material = words[0];
        iitem = words[1];
        type = words[1] == "剑" ? "剑" : "工具";
        typeId = 1;
    } else {
        // 是否为其他物品
        if (otherMaterial.indexOf(item) == -1) typeId = -1;
        else {
            material = item;
            iitem = item;
            type = item == "海龟壳" ? "盔甲" : item;
            typeId = 2;
        }
    }

    return { material: material, type: type, typeId: typeId, item: iitem };

    function split(name, dict1, dict2) {
        let i = 0;
        for (; i < name.length; i++) {
            const leftstr = item.slice(0, i), rightstr = item.slice(i);
            if (dict1.has(leftstr) && dict2.has(rightstr)) break;
        }
        return [item.slice(0, i), item.slice(i)].filter(v => !!v);
    }
}

// 按照权重在List中选择元素
function pick(list, weight) {
    let sum = 0;
    let probability = [];
    weight.forEach(i => sum += i);
    for (let cnt = 0; cnt < weight.length; cnt++) {
        const i = weight[cnt];
        probability.push(i / sum + (cnt == 0 ? 0 : probability[cnt - 1]));
    }
    let randNum = Math.random();
    probability.push(randNum);
    return list[probability.sort().indexOf(randNum)];
}

// 挑选附魔等级
function chosenEnchantmentLevel() {
    const chosenBase = () => { return (randomInt(1, 9) + Math.floor(bookshelfNum / 2) + randomInt(0, bookshelfNum + 1)) };
    let enchantmentLevel = [];
    enchantmentLevel.push(Math.max(Math.floor(chosenBase() / 3), 1));
    enchantmentLevel.push(Math.floor(chosenBase() * 2 / 3) + 1);
    enchantmentLevel.push(Math.max(chosenBase(), bookshelfNum * 2));
    return enchantmentLevel;
}

/**
 * 返回一个区间为[m,n-1]的随机整数
 * @param {int} m number
 * @param {int} n number
 * @returns 随机整数
 */
function randomInt(m, n) {
    return Math.floor(Math.random() * (n - m) + m);
}

/**
 * 返回一个区间为[0,1)的一个随机实数
 * @returns 返回随机实数
 */
function randomFloat() {
    return Math.random();
}

/**
 * 返回四舍五入至整数
 * @param {int} n number
 * @returns 整数
 */
function round(n) {
    return Math.round(n);
}