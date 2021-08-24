const getNextImg = require("./paint");

class Board {
    /**
     * 棋盘状态：0为空，1，-1为玩家
     * 小宫状态：0为未知，1，-1位玩家获得
     */
    constructor(img) {
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
    refreshGrid(r, c) {
        this.WIN.forEach(element => {
            if (this.boardStatus[r][c][element[0]] == this.boardStatus[r][c][element[1]]
                && this.boardStatus[r][c][element[1]] == this.boardStatus[r][c][element[2]]
                && this.boardStatus[r][c][element[0]] != 0) {
                this.setGridStatus(r, c, this.boardStatus[r][c][element[0]]);
                // break;
            }
        });
    }

    // 判断是否获胜
    isWin() {
        this.WIN.forEach(element => {
            if (this.gridStatus[element[0]] == this.gridStatus[element[1]]
                && this.gridStatus[element[1]] == this.gridStatus[element[2]]
                && this.gridStatus[element[0]] != 0) {
                this.winner = this.gridStatus[element[0]];
                // break;
            }
        })
        if (this.winner != 0) {
            return true;
        } else {
            return false;
        }
    }

    // 获得下一张图片buffer
    getNextImaBuffer = async (r, c, i, j, player) => {
        let currentRound = {
            'r': r,
            'c': c,
            'i': i,
            'j': j,
            'type': player == 1 ? 'x' : 'o'
        };
        let [imgWithSel, imgWithoutSel] = await getNextImg(this.img, currentRound);
        this.img = imgWithoutSel;
        let buf = await imgWithSel.getBufferAsync("image/png")
        return buf;
    }
}

// module.exports = Board;

function t() {
    console.log("d");
}
module.exports = t;