const { getNextImgWithSel, getNextImgWithoutSel, getWaitingImg, getGrid } = require("./paint");
const Jimp = require("jimp");
const path = require("path");

// let currentRound = {
//     "r": 1,
//     "c": 2,
//     "i": 2,
//     "j": 1,
//     "type": "x"
// };

// (async () => {
//     let bk = await Jimp.read(path.join(__dirname, "./resource/bkg.png"));
//     let t = await getGrid(bk, 0, 2, 'o');
// })()
function parsePosCmd(cmd, mode) {
    let i, j;
    if (mode === 1) {
        cmd--;
        j = cmd % 3;
        i = (cmd - j) / 3;
        return [i, j]
    } else if (mode === 2) {
        let cmdList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        let dy = cmdList.indexOf(cmd[0]);
        let dx = +cmd[1] - 1;
        i = dy % 3;
        j = dx % 3;
        let r = (dy - i) / 3;
        let c = (dx - j) / 3;
        return [r, c, i, j];
    }
}

console.log(parsePosCmd("6", 1));
console.log(parsePosCmd("h6", 2));