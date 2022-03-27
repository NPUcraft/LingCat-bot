console.log('plugin-echo loaded');

import { segment } from "oicq";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);

function apply(hook) {
    hook('onMessage', function (e) {
        if (e.cmd !== "") return;
        if (!getPermission(e.data, __dirname)) return;
        let msg = (e.data.raw_message + "").trim();
        let replyMsg = [];
        if (msg.startsWith("'") && msg.endsWith("'")) {
            e.data.message.forEach(m => {
                if (m.type === 'text') {
                    replyMsg.push(m?.text);
                } else if (m.type === 'face') {
                    replyMsg.push(segment.face(m?.id));
                } else if (m.type === 'image') {
                    replyMsg.push(segment.image(m?.url));
                } else if (m.type === 'at') {
                    replyMsg.push(segment.at(m?.qq));
                } else {
                }
            });
            // 去除消息首尾标识符''
            let msgLen = replyMsg.length;
            replyMsg[0] = replyMsg[0].trimLeft().slice(1);
            let msgEnd = replyMsg[msgLen - 1].trimRight();    // 消息尾
            replyMsg[msgLen - 1] = msgEnd.slice(0, msgEnd.length - 1)
            e.data.reply(replyMsg);
        }
    });
}

export { apply };