"use strict"

const fs = require("fs");
const path = require("path");
// const request = require("request");
//群文件下载到本地相应目录
//(bot,群号,群文件,下载后的文件)
//群文件：e.g.如该文件为A文件夹下的file.xml 则gfid应为"/A/file.xml"
//正常运行return 0,文件已存在则return -1
async function FileDLoad(_bot, group_id, fid) {
    let gfs = _bot.acquireGfs(group_id);
    let ls = await gfs.ls();
    fs.writeFileSync(path.join(__dirname, "./ls.json"), JSON.stringify(ls));
    let url;
    try {
        url = await gfs.download(fid);
    } catch (error) {
        console.log(error)
    }
    url.then(res => {
        let s = res;
        console.log(res);
    })
    //创建文件
    // if (!fs.existsSync(fid)) {
    //     fs.mkdirSync(fid);
    //     let stream = fs.createWriteStream(fid);
    //     request(url).pipe(stream).on("close", function (err) { });
    //     return 0;
    // }
    // else return -1;
}
exports.FileDLoad = FileDLoad;