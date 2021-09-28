"use strict"
const { getPermission } = require("../lib/permission");

async function echo(_bot, data, args = null) {
    if (!await getPermission(data, "echo")) return;
    data.reply(args[0]);
}
exports.echo = echo;