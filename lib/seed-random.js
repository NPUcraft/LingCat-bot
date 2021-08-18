const seed = require("seed-random");

/**
 * 得到一个大于等于0，小于1之间的随机数
 * @param {Any} seedId 随机种子
 * @returns 可设置种子的 [0,1) 随机数
 */
exports.getSeedRandom = function (seedId) {
    let randomGenerator = seed(seedId);
    return randomGenerator();
}

/**
 * 得到一个两数之间的随机数(左闭右开)
 * @param {Any} seedId 随机种子
 * @param {Int}} min 最小值
 * @param {Int} max 最大值
 * @returns 可设置种子的 [min,max) 随机数
 */
exports.getRandomArbitrary = function (seedId, min, max) {
    return this.getSeedRandom(seedId) * (max - min) + min;
}

/**
 * 得到一个两数之间的随机整数(左闭右开)
 * @param {Any} seedId 随机种子
 * @param {Int} min 生成随机数的下限
 * @param {Int} max 生成随机数的上限
 * @returns 可设置种子的 [min,max) 随机整数
 */
exports.getRandomInt = function (seedId, min, max) {
    return Math.floor(this.getRandomArbitrary(seedId, min, max));
}

/**
 * 得到一个两数之间的随机整数(左闭右闭)
 * @param {Any} seedId 随机种子
 * @param {Int} min 生成随机数的下限
 * @param {Int} max 生成随机数的上限
 * @returns 可设置种子的 [min,max] 随机整数
 */
exports.getRandomIntInclusive = function (seedId, min, max) {
    return Math.floor(this.getRandomArbitrary(seedId, min, max + 1));
}