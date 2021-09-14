"use strict"
const { getPermission } = require("../lib/permission");
const axios = require("axios");

async function noAbbreviated(_bot, data, args = null) {
    if (!await getPermission(data, "noAbbreviated")) return;
    let texts = data.message.filter(msg => msg.type === 'text');
    let textList = [];
    const reg = /[a-zA-Z]+/ig;
    texts.forEach(text => {
        let temp = Array(text?.data?.text.match(reg));
        if (temp[0] !== null) {
            temp[0].forEach(e => {
                textList.push(e);
            });
        }
    });
    if (textList.length === 0) return;
    let fullText = await getFullText(textList.join(" "));
    fullText = fullText.filter(e => typeof e?.trans !== "undefined");
    let msg = [];
    fullText.forEach(tran => {
        msg.push(tran?.trans[0]);
    })
    data.reply(msg.join("\n"));

}
exports.noAbbreviated = noAbbreviated;

const getFullText = async (text) => {
    try {
        let res = await axios.post('https://lab.magiconch.com/api/nbnhhsh/guess', { text: text });
        return res?.data;
    } catch (error) {
        console.error(error)
    }
}