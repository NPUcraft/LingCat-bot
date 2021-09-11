"use strict"
const { bot } = require("../../index");
const { segment } = require("oicq");
const path = require("path");
const { getPermission } = require("../../lib/permission");
const Jimp = require("jimp");
const { getNextImgWithSel, getNextImgWithoutSel, getWaitingImg, getPKImg, getGrid, selectPlayer } = require("./paint");
let playingGID = [];
let playerObj = {};
let msgId = {};
const help = `
[玩法简介]
超级井字棋是由九个井字棋棋盘组合而成，每个井字旗棋盘称为『小宫』
游戏中对手上一步下的小宫中的位置，就是你这一步能下的小宫位置
例如：
上一步下在了某一小宫的7号位，所以下一步只能下在第七个小宫里
[获胜方法]
小宫内的获胜规则和井字棋相同，玩家获胜即获得了该小宫
当你要下的小宫已被玩家获得时，可以通过坐标任意下子(e.g. b3)
当你在大宫中将你胜利的小宫连成一条线时，你就获胜了
[下棋方法]
<-井字棋>: 创建对局
<加入>: 发送者加入对局
<不想玩了>: 退出对局
输入1~9下棋（已自动为你确定要下的小宫位置，由橙(蓝)框框选）
`.trim();

class Board {
    /**
     * 棋盘状态：0为空，1，-1为玩家
     * 小宫状态：0为未知，1，-1位玩家获得,2为平局
     */
    constructor(img) {
        this.freeStatus = false;    // 自由状态:目前可以任意下子的状态
        this.img = img;
        this.boardStatus = (() => {
            let tmp = [];
            for (let i = 0; i < 3; i++) {
                tmp[i] = new Array();
                for (let j = 0; j < 3; j++) {
                    tmp[i][j] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
            return tmp;
        })();
        this.gridStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.WIN = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];  // 获胜情况
        this.winner = 0;
    }

    // 设置棋盘状态
    setBoardStatus(r, c, i, j, value) {
        this.boardStatus[r][c][i * 3 + j] = value;
    }

    // 设置小宫状态
    setGridStatus(r, c, value) {
        this.gridStatus[r * 3 + c] = value;
    }

    // 刷新选定小宫状态
    refreshGrid(r, c, i, j) {
        if (this.gridStatus[3 * i + j] !== 0) {
            this.freeStatus = true;
        } else {
            this.freeStatus = false;
        }
        if (this.gridStatus[3 * r + c] !== 0) return;   // 有人获得小宫则不刷新该小宫状态
        for (let index = 0; index < this.WIN.length; index++) {
            const element = this.WIN[index];
            if (this.boardStatus[r][c][element[0]] == this.boardStatus[r][c][element[1]]
                && this.boardStatus[r][c][element[1]] == this.boardStatus[r][c][element[2]]
                && this.boardStatus[r][c][element[0]] != 0) {
                this.setGridStatus(r, c, this.boardStatus[r][c][element[0]]);
                break;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (this.boardStatus[r][c][i] === 0) break;
            if (i === 8) this.setGridStatus(r, c, 2);
        }

    }

    // 判断是否获胜
    isWin() {
        for (let index = 0; index < this.WIN.length; index++) {
            const element = this.WIN[index];
            if (this.gridStatus[element[0]] == this.gridStatus[element[1]]
                && this.gridStatus[element[1]] == this.gridStatus[element[2]]
                && this.gridStatus[element[0]] != 0) {
                this.winner = this.gridStatus[element[0]];
                break;
            }
        }

        if (this.winner != 0) {
            return true;
        } else {
            return false;
        }
    }

    // 判断是否平局
    isTie() {
        for (let i = 0; i < 9; i++) {
            if (this.gridStatus[i] === 0) return false;
        }
        return true;
    }

    generatePKImg = async (player1Img, player2Img) => {
        await getPKImg(this.img, player1Img, player2Img);
    }

    // 获得下一张图片buffer[如果已获得则显示已获得，如果下一步是自由状态，不添加选区]
    getNextImaBuffer = async (r, c, i, j, player) => {
        let currentRound = {
            'r': r,
            'c': c,
            'i': i,
            'j': j,
            'type': player == 1 ? 'x' : 'o'
        };
        let imgWithoutSel = await getNextImgWithoutSel(this.img, currentRound);
        if (Math.abs(this.gridStatus[3 * r + c]) === 1) {
            await getGrid(imgWithoutSel, r, c, this.gridStatus[3 * r + c] == 1 ? 'x' : 'o');
        }
        let imgWithSel = imgWithoutSel.clone();
        if (!this.isWin()) {
            await selectPlayer(imgWithSel, player == 1 ? 'o' : 'x');
            if (!this.freeStatus) {
                await getNextImgWithSel(imgWithSel, currentRound);
            }
        }
        let buf = await imgWithSel.getBufferAsync("image/png")
        return buf;
    }
}

async function ticTactics(data, args) {
    if (!await getPermission(data, "井字棋")) return;
    if (args.length === 1 && ["help", '帮助'].indexOf(args[0]) !== -1) {
        data.reply(help);
        return;
    } else if (args.length > 1) {
        return;
    }
    if (playingGID.indexOf(data.group_id) !== -1) return;
    playingGID.push(data.group_id);
    const field = String(data.group_id);
    playerObj[field] = [data.sender.user_id];

    let r = Math.floor(Math.random() * 3);
    let c = Math.floor(Math.random() * 3);
    let player = 1;
    let gameStatus = 1; // 游戏状态：正在进行
    let bk = await Jimp.read(path.join(__dirname, "./resource/bkg.png"));
    let bkClone = bk.clone();
    await getNextImgWithSel(bkClone, {
        "i": r,
        "j": c,
        "type": player == 1 ? 'o' : 'x'
    });
    let player1Img = await Jimp.read(`http://q1.qlogo.cn/g?b=qq&nk=${data.user_id}&s=100`);
    await getWaitingImg(bkClone, player1Img);
    let bkBuf = await bkClone.getBufferAsync("image/png");

    msgId[field] = [];

    let msgid = await data.reply([segment.image(bkBuf)]);
    msgId[field].push(msgid);
    let ticGame = new Board(bk);

    // 六十分钟超时结束游戏
    let gameTimeOut = new setTimeout(async () => {
        data.reply("没人玩井字棋我就溜啦~");
        let index = playingGID.indexOf(data.group_id);
        playingGID.splice(index, 1);
        delete playerObj[field];
        bot.off("message.group.normal", run);
        bot.off("message.group.normal", joinGame);
    }, 60 * 60 * 1000);


    async function joinGame(e) {
        if (e.group_id === data.group_id
            && e.raw_message.trim() === "加入"
            && playerObj[field][0] !== e.sender.user_id) {
            playerObj[field].push(e.sender.user_id);
            e.reply([segment.text(`对局开始:\n蓝色方`),
            segment.at(playerObj[field][0]),
            segment.text(`\n橙色方`),
            segment.at(playerObj[field][1]),
            segment.text(`\n由蓝色方先行开局`)
            ]);

            let player2Img = await Jimp.read(`http://q1.qlogo.cn/g?b=qq&nk=${e.user_id}&s=100`);
            await ticGame.generatePKImg(player1Img, player2Img);
            let pk = ticGame.img.clone();
            await getNextImgWithSel(pk, {
                "i": r,
                "j": c,
                "type": player == 1 ? 'o' : 'x'
            });
            let megid = await e.reply([segment.image(await pk.getBufferAsync("image/png"))]);
            msgId[field].push(megid);
            bot.off("message.group.normal", joinGame);
        }
    }
    bot.on("message.group.normal", joinGame);
    async function run(e) {
        if (!(e.group_id === data.group_id && playerObj[field].length === 2)) return;   // 不够两人不开始
        if (e.sender.user_id !== playerObj[field][Math.abs(player >> 1)]) return;   // 不是当前回合的玩家不相应
        let cmd = e.raw_message.trim().toLowerCase();

        // 退出命令
        if (cmd === "不想玩了") {
            data.reply("游戏结束");
            let index = playingGID.indexOf(data.group_id);
            playingGID.splice(index, 1);
            delete playerObj[field];
            bot.off("message.group.normal", run);
        }

        // 处理命令
        let i, j;
        if (cmd.length === 1 && cmd <= '9' && cmd >= '1' && (!ticGame.freeStatus)) {    // 数字命令
            [i, j] = parsePosCmd(cmd, 1);
            if (ticGame.boardStatus[r][c][3 * i + j] !== 0) {
                e.reply(`请在其他地方落子`);
                return;
            }
        } else if (cmd.length === 2 && cmd[0] <= 'i' && cmd[0] >= 'a'
            && cmd[1] <= '9' && cmd[1] >= '1') {            // 坐标命令
            let [tempr, tempc, tempi, tempj] = parsePosCmd(cmd, 2);
            if (!((tempr === r && tempc === c && ticGame.freeStatus == false
                && ticGame.boardStatus[r][c][3 * tempi + tempj] === 0)  // 约束状态下如果不在指定区域内则不响应
                ||
                (ticGame.freeStatus == true && ticGame.gridStatus[3 * tempr + tempc] === 0
                    && ticGame.boardStatus[tempr][tempc][3 * tempi + tempj] === 0))) {// 自由放置下在已获得小宫不响应
                e.reply(`请在其他地方落子`)
                return;
            }
            c = tempc, r = tempr, i = tempi, j = tempj;
        } else {
            return;
        }

        ticGame.setBoardStatus(r, c, i, j, player);
        ticGame.refreshGrid(r, c, i, j);  // 刷新所下棋小宫状态【同时确定下一步是否为自由状态
        let buf = await ticGame.getNextImaBuffer(r, c, i, j, player);
        let msgid = await e.reply([segment.image(buf)]);
        msgId[field].push(msgid);
        bot.deleteMsg(msgId[field].splice(0, 1)[0].data.message_id);

        player = -player;   // 交换对手
        r = i; c = j;   // 记录下一步落子小宫位置
        if (ticGame.isWin()) {
            // 如果有人胜利

            let winnerQid = ticGame.winner == 1 ? playerObj[field][0] : playerObj[field][1];
            e.reply([segment.text(`恭喜玩家`),
            segment.at(winnerQid),
            segment.text(`获得胜利！`)
            ]);
            gameStatus = 0;
        }
        if (ticGame.isTie() && gameStatus !== 0) {
            e.reply(`本局是个平局~`);
            gameStatus = 0;
        }

        if (!gameStatus) {
            let index = playingGID.indexOf(e.group_id);
            playingGID.splice(index, 1);
            delete playerObj[field];
            clearTimeout(gameTimeOut);
            bot.off("message.group.normal", run);
        }
    }
    bot.on("message.group.normal", run);

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
}
exports.ticTactics = ticTactics;