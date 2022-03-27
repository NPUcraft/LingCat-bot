import path from "path";
import fs from "fs";

/**
 * 写文件
 * @param {string|Array} fpath 文件相对路径
 * @param {string} data 要写入的数据
 * @param {boolean} overwrite 是否覆写
 * @returns 
 */
function writeFileSync(fpath, data, overwrite = false) {
    fpath = (fpath instanceof Array) ? fpath.join(path.sep) : fpath;
    const filePath = path.resolve(fpath);   // 解析文件绝对路径
    if (fs.existsSync(filePath) && !overwrite) return;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, true);

    fs.writeFileSync(filePath, data);
}

/**
 * 在指定路径下写配置文件
 * @param {string} filename 配置文件名字
 * @param {string} data json格式配置字符串
 * @param {boolean} overwrite 覆写
 */
function writeConfigSync(filename, data, overwrite = false) {
    const filePath = path.resolve("data/config", filename);
    writeFileSync(filePath, data, overwrite);
}

/**
 * 读取json文件
 * @param {string|Array} fpath 文件相对路径
 * @returns 对象类型内容
 */
function loadFileAsJson(fpath) {
    fpath = (fpath instanceof Array) ? fpath.join(path.sep) : fpath;
    const filePath = path.resolve(fpath);

    if (!fs.existsSync(filePath)) return null;

    try {
        return JSON.parse(fs.readFileSync(filePath).toString());
    } catch (e) {
        console.warn(`[WARN] ${fpath} 可能不是json文件`);
        return null;
    }
}

/**
 * 加载配置文件
 * @param {string} filename 配置文件名字
 */
function loadConfigAsJson(filename) {
    const filePath = path.resolve("data/config", filename);
    return loadFileAsJson(filePath);
}


/**
 * 删除文件夹下所有文件
 * @param {*} path 
 */
function emptyDir(fpath) {
    const emptyPath = path.resolve(fpath);
    const files = fs.readdirSync(emptyPath);
    files.forEach(file => {
        const filePath = path.resolve(`${emptyPath}/${file}`);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) emptyDir(filePath)
        else fs.unlinkSync(filePath);
    });
}

/**
 * 删除指定路径下的所有空文件夹
 * @param {*} path 
 */
function rmEmptyDir(fpath, level = 0) {
    const filePath = path.resolve(fpath);
    const files = fs.readdirSync(filePath);
    if (files.length > 0) {
        let tempFile = 0;
        files.forEach(file => {
            tempFile++;
            rmEmptyDir(path.resolve(`${filePath}/${file}`), 1);
        });
        if (tempFile === files.length && level !== 0) {
            fs.rmdirSync(filePath);
        }
    }
    else {
        level !== 0 && fs.rmdirSync(filePath);
    }
}

/**
 * 清空指定路径下的所有文件及文件夹
 * @param {*} path 
 */
function clearDir(path) {
    emptyDir(path);
    rmEmptyDir(path);
}

export {
    writeFileSync,      // 写文件
    writeConfigSync,    // 在指定路径下写配置文件
    loadConfigAsJson,   // 加载配置文件
    loadFileAsJson,     // 读取json文件
    clearDir            // 清空指定路径下所有文件及文件夹
};