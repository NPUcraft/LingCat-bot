/**
 * @param {Int} upper | 生成四个范围[1, upper]随机数
 * @returns {object}  | data:四个数, result:所有解答
 */
exports.twentyFourPoints = function (upper, target) {
    const error = 1e-6;
    const ADD = 0, MULTIPLY = 1, SUBTRACT = 2, DIVIDE = 3;
    // 随机生成数据
    let data = [];
    for (let i = 0; i < 4; i++) {
        data[i] = Math.round(Math.random() * (upper - 1) + 1);
    }
    let result = [];

    let solution1 = [];
    let solution2 = [];
    let solution3 = [];
    let ii, jj, opr;    // 记录解答步骤

    // solve
    let solve = function (dataList) {
        if (dataList.length == 0) {
            return false;
        }
        if (dataList.length == 1) {
            solution3 = [ii, jj, opr];
            if (Math.abs(dataList[0] - target) < error) {
                let parseRes = parseSolution(data, solution1.concat(solution2.concat(solution3)));
                if (result.indexOf(parseRes) == -1) {
                    result.push(parseRes);
                }
                return true;
            }
            else {
                return false;
            }
        }
        if (dataList.length == 2) {
            solution2 = [ii, jj, opr];
        }
        if (dataList.length == 3) {
            solution1 = [ii, jj, opr];
        }
        let size = dataList.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i != j) {
                    let newDataList = [];
                    let newSize = 0;
                    for (let k = 0; k < size; k++) {
                        if (k != i && k != j) {
                            newDataList[newSize++] = dataList[k];
                        }
                    }

                    for (let op = 0; op < 4; op++) {
                        if (op < 2 && i > j) {
                            continue;
                        }
                        ii = i;
                        jj = j;
                        opr = op;
                        if (op == ADD) {
                            newDataList[newSize] = dataList[i] + dataList[j];
                        }
                        else if (op == MULTIPLY) {
                            newDataList[newSize] = dataList[i] * dataList[j];
                        }
                        else if (op == SUBTRACT) {
                            newDataList[newSize] = dataList[i] - dataList[j];
                        }
                        else if (op == DIVIDE) {
                            if (Math.abs(dataList[j]) < error) {
                                continue;
                            }
                            newDataList[newSize] = dataList[i] * 1.0 / dataList[j];
                        }

                        if (solve(newDataList)) {
                            continue;
                        }
                    }
                }
            }
        }
        if (result == false) {
            return false;
        } else {
            return true;
        }
    }

    // 解析 记录的解答步骤 为 字符串
    function parseSolution(list, solution) {
        let index = 0;
        let oprList = ["+", "*", "-", "/"];
        let tempList = [];
        for (let i = 0, j = 0; i < list.length; i++) {
            if (i != solution[0] && i != solution[1]) {
                tempList[j++] = list[i];
            }
        }
        let resStr = "";
        resStr += ("(" + list[solution[index]] + oprList[solution[index + 2]] + list[solution[index + 1]] + ")");
        tempList.push(resStr);
        let tempList2 = [];
        for (let i = 0, j = 0; i < tempList.length; i++) {
            if (i != solution[3] && i != solution[4]) {
                tempList2[j++] = tempList[i];
            }
        }
        resStr = ("(" + tempList[solution[index + 3]] + oprList[solution[index + 5]] + tempList[solution[index + 4]] + ")");
        tempList2.push(resStr);
        resStr = ("(" + tempList2[solution[index + 6]] + oprList[solution[index + 8]] + tempList2[solution[index + 7]] + ")");
        return resStr;
    }

    if (solve(data)) {
        return { "data": data, "result": result };
    }
    else {
        return { "data": data, "result": false };
    }
}


/*
// test.js

let games = require("./games");
let list = [2, 3, 7, 4];
let str = "（7-3)*(4+2） ";
try {
    console.log(games.check(list, str));
} catch (error) {
    console.log(error.message);
}

*/


/**
 *  
 * @param {array} list | 游戏中的四个数
 * @param {string} str | 玩家解答字符串
 * @returns true|false：正确或错误； 
 *          Error.message:玩家输入错误信息
 *              - "错误的表达式！"
 *              - "请用给定的数字解答！"
 *              - "验证此题无解"
 */
exports.check = function (list, target, str) {
    if (str.trim() === "无解") {
        throw new Error("验证此题无解");
    }

    str = str.replace(/以/g, '');
    str = str.replace(/\s+/ig, '');
    // // 对习惯性乘法写法添加*
    // str = str.replace(/([)）])([(（])/g, "$1*$2");
    // str = str.replace(/([)）])(\d)/g, "$1*$2");
    // str = str.replace(/(\d)([(（])/g, "$1*$2");

    let strList = parseNumber(str);
    let result = "";
    for (let char of str) {
        if (char === '（' || char === '(') {
            result += '(';
        }
        else if (char === '）' || char === ')') {
            result += ')';
        }
        else if (char >= '0' && char <= '9') {
            result += ' ';  // 标识符，后续替换为数字
        }
        else if (char === '+' || char === '加' || char === '＋') {
            result += '+';
        }
        else if (char === '-' || char === '减' || char === '－') {
            result += '-';
        }
        else if (char === '*' || char === 'x' || char === 'X' || char === '×' || char === '乘' || char === '·') {
            result += '*';
        }
        else if (char === '/' || char === '\\' || char === '除' || char === '÷') {
            result += '/';
        }
        else if (char === ' ') {
        }
        else {
            throw new Error("错误的表达式！");
        }
    }
    result = result.replace(/\s+/ig, ' ');
    for (let i = 0; i < 4; i++) {
        result = result.replace(' ', String(strList[i]));
    }

    if (!arraysEqual(list.sort(), strList.sort())) {
        throw new Error("请用给定的数字解答！");
    }

    const { limitedEvaluate } = require("../../lib/limited-evaluate");
    try {
        return Math.abs(limitedEvaluate(result) - target) < 1e-6;
    } catch (error) {
        throw new Error("错误的表达式！");
    }

    // 比较数组是否相等
    function arraysEqual(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    // 解析字符串的数字
    function parseNumber(str) {
        return str.replace(/[^0-9]/ig, ' ').trim().split(/\s+/).map(Number);
    }
}