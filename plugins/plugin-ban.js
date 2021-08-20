"use strict"
const { bot } = require("../index");
const mongodbUtils = require("../lib/mongodb");
const fs = require("fs");
const path = require("path");
const databaseInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).mongo;
const database = databaseInfo.database;
const collection = databaseInfo.collection;

function banned(data) {
    if (data.duration > 0) {    // 被禁言
        mongodbUtils.findAndUpdateDocument(database, collection, { "group_id": data.group_id }, {
            "banned": true
        })
    } else if (data.duration === 0) {  // 被解除禁言
        mongodbUtils.findAndUpdateDocument(database, collection, { "group_id": data.group_id }, {
            "banned": false
        })
    }
}
module.exports = banned;