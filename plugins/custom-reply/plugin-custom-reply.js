"use strict"

// 临时添加的回复功能
this.on("message.group.normal", (data) => {
    this.getGroupMemberInfo(data.group_id, data.sender.user_id).then(res => {
        // 判断是否是新人
        let join_time = new Date(res.data.join_time * 1e3);
        let time = Date.now() - join_time;
        let newTime = 10;// 判定为新人的时间，单位：天
        //console.log(time / 86400000);
        let isNew = ((time / 86400000 < newTime) || data.sender.level == 1 || data.sender.user_id == 1368616836) ? true : false;

        // 判断是否在指定群
        let isGroup = (data.group_id == 598445021 || data.group_id == 710085830) ? true : false;
        // 判断是否是机器人id
        let isID = (data.sender.user_id != 2987084315 && data.sender.user_id != 1354825038) ? true : false;
        //console.log(isNew, isGroup, isID);

        if (isNew && isGroup && isID) {
            if (RegExp(/考核服/).test(data.message[0].data.text) == true) {
                this.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n请阅读新手安装图文教程来进入考核服：http://wiki.npucraft.top/npucraftwiki/index.php/NPUcraft%E6%96%B0%E6%89%8B%E5%AE%89%E8%A3%85%E5%9B%BE%E6%96%87%E6%95%99%E7%A8%8B");
            }
            if (RegExp(/基岩版/).test(data.message[0].data.text) == true || RegExp(/手机/).test(data.message[0].data.text) == true) {
                this.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器可以使用基岩版进服，群文件→基岩版（互通专供）安装包 可获取安装包。\n详请阅读：http://wiki.npucraft.top/npucraftwiki/index.php/%E5%9F%BA%E5%B2%A9%E7%89%88%E4%BA%92%E9%80%9A");
            }
            if (RegExp(/java/i).test(data.message[0].data.text) == true) {
                this.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\nMC1.17之后必须安装Java1.16或更高版本，下载链接: https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/16/jre/x64/windows/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.msi");
            }
            if (RegExp(/(服).*(版本)/).test(data.message[0].data.text) == true) {
                this.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器生存服是1.17.1版本");
            }
            if (RegExp(/建筑服/).test(data.message[0].data.text) == true || RegExp(/复原/).test(data.message[0].data.text) == true) {
                this.sendGroupMsg(data.group_id, "[CQ:at,qq=" + data.sender.user_id + "]" + "\n本服务器建筑服目前正在社团内部进行删档测试。本校学生若想参与复原工程可联系群管理SUPER2FH。\n进入建筑服硬性要求：\n1.非观光摸鱼党；\n2.需要为西工大在校生或毕业生。");
            }
        }
    })
})