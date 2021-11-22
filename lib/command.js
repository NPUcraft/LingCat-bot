/**
 * 解析命令为cmd和args列表
 * @param {String} cmdStr 待解析字符
 * @returns Array
 */

/*
关于解析命令的思路
有可能的参数大致分为5类：
1.命令
2.开头不为"-"，"#"的闲聊消息
3.开头为"-"，"#"的闲聊消息
4.开头不为"-"，"#"的自定义回复的关键词
5.开头为"-"，"#"的自定义回复的关键词
需要保证不出bug的优先级按照以上顺序排列(不出bug指命令、关键词能正常触发，正常消息不会误触)

对于1，需要保证(之后的优先级均按数字顺序排列)：
1)后面的参数以空格分割(#set除外)
2)后面的参数被处理后不会变
3)能识别大写
4)后接参数的时候不用空格而用换行、tab等其他空白字符

*/

function parseCommand(cmdStr) {
    if (!(cmdStr.startsWith("-") || cmdStr.startsWith("#"))) return [];

    cmdStr = cmdStr.replace(/\s+/i, " ").trim(); // 能识别指令接参数时候换行、tab等
    let list = cmdStr.split(" ");
    list[0] = list[0].trimLeft().toLowerCase(); // 将命令小写化处理
    let cmd = list[0];
    cmdStr = list.slice(0, this.length).join(" ");  // 包含命令的原字符串，命令经过小写化处理
    contStr = list.slice(1, this.length).join(" "); // 不包含命令的原字符串
    //console.log(contStr);

    let rawKeyValue, key, contents;
    switch (cmd) {
        case "#set": // 自定义回复和正则回复放在一起
            let regKeyList = ["regular", "reg","r","正则","pattern","p","模式"];
            if (regKeyList.includes(list[1]) == true) {
                console.log(regKeyList);
            }
            if (cmdStr.indexOf('＝') !== -1) rawKeyValue = cmdStr.replace("#set ", "").split("＝");
            else rawKeyValue = cmdStr.replace("#set ", "").split("=");
            key = rawKeyValue[0].trim();
            let value = rawKeyValue.slice(1, this.length).join("=").trimLeft();
            return [cmd, key, value]; 
        case "#del":
        case "-send":
        case "#welcome":
        case "-echo":
            return [cmd, contStr];
    }

    return list;
}
module.exports = parseCommand;