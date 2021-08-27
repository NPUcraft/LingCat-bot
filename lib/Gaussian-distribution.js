"use strict"
//高斯分布
function Gaussian(mean, std, size) {
    function normalRandom(mean, std) {
        let u = 0.0, v = 0.0, w = 0.0, c = 0.0;
        do {
            //获得两个（-1,1）的独立随机变量
            u = Math.random() * 2 - 1.0;
            v = Math.random() * 2 - 1.0;
            w = u * u + v * v;
        } while (w == 0.0 || w >= 1.0)
        //Box-Muller转换
        c = Math.sqrt((-2 * Math.log(w)) / w);
        let normal = mean + (u * c) * std;
        return normal;
    }
    //用于生产服从正态分布的随机数矩阵
    function normalRandomSize(mean, std, size) {
        let normal = [];
        for (let i = 0; i < size; i++) {
            normal[i] = normalRandom(mean, std);
        }
        return normal;
    }
    let pool = normalRandomSize(mean, std, size)
    return (pool)
}
module.exports = Gaussian