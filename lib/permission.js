import path from "path";
import { loadFileAsJson, writeConfigSync } from "./file-system.js";
const botInfo = loadFileAsJson("data/account.json");
const botEnv = loadFileAsJson("data/bot-env.json");

/**
 * 判断该群是否有权限使用插件
 * @param {object} data message data
 * @param {string} pluginDir 插件路径
 * @param {boolean|array} skipCheckCmd 默认跳过命令检查，否则根据传入的[cmdFlag,cmd]检查命令是否正确
 * @returns 权限
 */
function getPermission(data, pluginDir, skipCheckCmd = true) {
    const blacklist = loadFileAsJson("data/config/blacklist.json");
    const cfg = loadFileAsJson([pluginDir, "config.json"]);
    const cmdFlag = (cfg.permission.indexOf("member") === -1) ? botEnv.adminCmdFlag : botEnv.cmdFlag;
    let superUser = botEnv.SUPERUSER;
    superUser.push(botInfo.owner);  // 超级用户列表
    let pluginName = loadFileAsJson([pluginDir, "config.json"]).pluginName;
    pluginName = pluginName == "" ? pluginDir.split(path.sep).pop() : pluginName;   // 从文件夹名或配置文件中获得插件名

    const gid = String(data.group_id);
    let permission = loadFileAsJson("data/config/permission.json");
    if (permission == null) {   // 不存在配置文件则创建
        writeConfigSync("permission.json", "{}");
        permission = {};
    };

    let doc = permission?.[gid];    // 当前群权限文档

    // 通知事件
    if (data.post_type === "notice") {
        // 被禁言则拒绝
        if (data.group?.mute_left !== 0) return false;
        // 群通知通过
        if (data.notice_type === "group") return doc?.[pluginName];
        // // 好友通知 验证私聊插件可用性(暂拒绝所有好友通知事件)
        // else if (data.notice_type === "friend") return cfg.privateAvl;
        // 其他通知拒绝
        else return false;
    }

    // 消息事件
    if (data.post_type === "message") {
        // 黑名单则拒绝
        if (blacklist.indexOf(data.user_id) !== -1) return false;
        // 群消息
        // if (!doc) return false; // 未安装
        // 验证该群是否注册该插件
        // 验证是否为超级用户或具备使用插件的权限
        // 验证命令正确性(大小写不敏感)
        let isCreate = doc?.[pluginName];
        let isAdmin = (cfg.permission.indexOf(data.sender.role) !== -1 || superUser.indexOf(data.user_id) !== -1 || cfg.permission.length == 3);
        let isCmdRight = ((typeof skipCheckCmd == "boolean" && skipCheckCmd) || (cfg.cmd.indexOf(skipCheckCmd[1].toLowerCase()) !== -1 && cmdFlag.indexOf(skipCheckCmd[0]) !== -1));
        if (data.message_type === "group")
            return isCreate && isAdmin && isCmdRight && doc && (data.group?.mute_left == 0);
        //私聊消息
        // 在群消息基础上验证私聊中该插件可用性
        else if (data.message_type === "private")
            return isAdmin && isCmdRight && cfg.privateAvl;
        // 其他消息拒绝
        else return false;
    }
}
export { getPermission };