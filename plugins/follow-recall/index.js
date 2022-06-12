console.log('plugin-follow-recall loaded');

import _ from "lodash";
import { getPermission } from "../../lib/permission.js";
import dirname from "../../lib/dirname.js";
const __dirname = dirname(import.meta.url);


function apply(hook) {
    hook('onNotice', function (e) {
        /* 检查命令是否匹配及其功能使用权限 */
        if (!getPermission(e.data, __dirname)) return;
        if (e.data.sub_type !== "recall") return;
        let msgId = e.data.messageDic[e.data.message_id];
        if (!msgId) {
            setTimeout(() => {
                msgId = e.data.messageDic[e.data.message_id];
                if (msgId) e.data.group.recallMsg(msgId);
            }, 30 * 1000);
        }
        else {
            e.data.group.recallMsg(msgId);
        };
    });
}

export { apply };