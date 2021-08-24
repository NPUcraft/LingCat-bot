const Jimp = require("jimp");
const path = require("path");

/**
 * 选择区域
 * @param {Jimp} img pic
 * @param {Number} r 
 * @param {Number} c 
 * @returns {Jimp}
 */
async function selectRegion(img, r, c, type) {
    let selected = await Jimp.read(path.join(__dirname, "./resource/selected.png"));
    let selectedBlue = await Jimp.read(path.join(__dirname, "./resource/selected_blue.png"));
    if (type === 'x') {
        img.composite(selectedBlue, (640 - 40) * c / 3 + 40, (640 - 40) * r / 3 + 40);
    } else {
        img.composite(selected, (640 - 40) * c / 3 + 40, (640 - 40) * r / 3 + 40);
    }
    // if (type === 'x') {
    //     img.composite(selectedBlue, (img.bitmap.width - 40) * c / 3 + 40, (img.bitmap.height - 40) * r / 3 + 40);
    // } else {
    //     img.composite(selected, (img.bitmap.width - 40) * c / 3 + 40, (img.bitmap.height - 40) * r / 3 + 40);
    // }
    return img;
}

/**
 * 选择要下的位置和棋子种类
 * @param {Jimp} img pic
 * @param {Number} r 
 * @param {Number} c 
 * @param {Number} i 
 * @param {Number} j 
 * @param {String} type "x"|"o"
 * @returns {Jimp}
 */
async function selectPos(img, r, c, i, j, type) {
    let x = await Jimp.read(path.join(__dirname, "./resource/x.png"));
    let o = await Jimp.read(path.join(__dirname, "./resource/o.png"));
    let di, dj;
    if (r == 0) {
        if (c == 0) {           // (r,c)=(0,0)
            di = 53;
            dj = 50;
        } else if (c == 1) {    // (r,c)=(0,1)
            di = 53;
            dj = 65;
        } else {                // (r,c)=(0,2)
            di = 53;
            dj = 80;
        }

    } else if (r == 1) {
        if (c == 0) {           // (r,c)=(1,0)
            di = 68;
            dj = 50;
        } else if (c == 1) {    // (r,c)=(1,1)
            di = 68;
            dj = 65;
        } else {                // (r,c)=(1,2)
            di = 68;
            dj = 80;
        }
    } else {
        if (c == 0) {           // (r,c)=(2,0)
            di = 83;
            dj = 50;
        } else if (c == 1) {    // (r,c)=(2,1)
            di = 83;
            dj = 65;
        } else {                // (r,c)=(2,2)
            di = 83;
            dj = 80;
        }
    }
    if (type === 'o') {
        img.composite(o, (640 - 80) * (3 * c + j) / 9 + dj,
            (640 - 80) * (3 * r + i) / 9 + di);
    } else {
        img.composite(x, (640 - 80) * (3 * c + j) / 9 + dj,
            (640 - 80) * (3 * r + i) / 9 + di);
    }
    // if (type === 'o') {
    //     img.composite(o, (img.bitmap.width - 80) * (3 * c + j) / 9 + dj,
    //         (img.bitmap.height - 80) * (3 * r + i) / 9 + di);
    // } else {
    //     img.composite(x, (img.bitmap.width - 80) * (3 * c + j) / 9 + dj,
    //         (img.bitmap.height - 80) * (3 * r + i) / 9 + di);
    // }
    return img;

}

/**
 * 根据当前回合返回下一步图片
 * @param {Jimp} img pic
 * @param {Object} currentRound {r,c,i,j,type}
 * @return {Jimp}  imgWithSelecte
 */
async function getNextImgWithoutSel(img, currentRound) {
    let imgWithSele = await selectPos(img, currentRound.r, currentRound.c,
        currentRound.i, currentRound.j, currentRound.type);
    let nextType = currentRound.type === "x" ? "o" : "x";
    return imgWithSele;
}

async function getNextImgWithSel(img, currentRound) {
    let nextType = currentRound.type === "x" ? "o" : "x";
    let imgWithoutSele = await selectRegion(img, currentRound.i, currentRound.j, nextType);
    return imgWithoutSele;
}

async function getWaitingImg(img, userImg) {
    let x = await Jimp.read(path.join(__dirname, "./resource/x.png"));
    let o = await Jimp.read(path.join(__dirname, "./resource/o.png"));
    let player1 = await userImg.resize(100, 100);
    let player2 = await Jimp.read(path.join(__dirname, "./resource/player.png"));
    let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    img.composite(player1, img.bitmap.width / 14 * 11, img.bitmap.height / 4);
    img.composite(x, img.bitmap.width / 14 * 11.3, img.bitmap.height / 5 * 2.2);
    img.composite(o, img.bitmap.width / 14 * 11.3, img.bitmap.height / 5 * 3.3);
    img.print(font, img.bitmap.width / 14 * 10.6, img.bitmap.height / 32 * 29, 'WAITING...');
    img.composite(player2, img.bitmap.width / 14 * 11, img.bitmap.height / 4 * 3);
    return img;
}

async function getPKImg(img, player1Img, player2Img) {
    let x = await Jimp.read(path.join(__dirname, "./resource/x.png"));
    let o = await Jimp.read(path.join(__dirname, "./resource/o.png"));
    let player1 = await player1Img.resize(100, 100);
    let player2 = await player2Img.resize(100, 100);
    img.composite(player1, img.bitmap.width / 14 * 11, img.bitmap.height / 4);
    img.composite(x, img.bitmap.width / 14 * 11.3, img.bitmap.height / 5 * 2.2);
    img.composite(o, img.bitmap.width / 14 * 11.3, img.bitmap.height / 5 * 3.3);
    img.composite(player2, img.bitmap.width / 14 * 11, img.bitmap.height / 4 * 3);
    return img;
}

async function getGrid(img, r, c, type) {
    let XX = await Jimp.read(path.join(__dirname, "./resource/xx.png"));
    let OO = await Jimp.read(path.join(__dirname, "./resource/oo.png"));
    if (type === 'x') {
        img.composite(XX, (640 - 40) * c / 3 + 65, (640 - 40) * r / 3 + 65);
    } else {
        img.composite(OO, (640 - 40) * c / 3 + 65, (640 - 40) * r / 3 + 65);
    }
    return img;
}

async function selectPlayer(img, type) {
    let SelectX = await Jimp.read(path.join(__dirname, "./resource/blueRound.png"));
    let SelectO = await Jimp.read(path.join(__dirname, "./resource/orangeRound.png"));
    if (type === 'x') {
        img.composite(SelectX, img.bitmap.width / 14 * 10.13, img.bitmap.height / 8 * 1.4);
    } else {
        img.composite(SelectO, img.bitmap.width / 14 * 10.13, img.bitmap.height / 8 * 4.6);
    }
    return img;
}

exports.selectPlayer = selectPlayer;
exports.getNextImgWithoutSel = getNextImgWithoutSel;
exports.getNextImgWithSel = getNextImgWithSel;
exports.getWaitingImg = getWaitingImg;
exports.getPKImg = getPKImg;
exports.getGrid = getGrid;