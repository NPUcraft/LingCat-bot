const { getNextImgWithSel, getNextImgWithoutSel, getWaitingImg, getGrid } = require("./paint");
const Jimp = require("jimp");
const path = require("path");

let currentRound = {
    "r": 1,
    "c": 2,
    "i": 2,
    "j": 1,
    "type": "x"
};

(async () => {
    let bk = await Jimp.read(path.join(__dirname, "./resource/bkg.png"));
    let t = await getGrid(bk, 0, 2, 'o');
})()