"use strict"
let data = { "group_id": 920326805 };
const mongodbUtils = require("./mongodb");
const database = "LingCat";
const collection = "Permission"
async function func1(data) {
    if (true) {
        let chances = 2;
        if (chances > 0) {
            let gameTimeOut = new setTimeout(async () => {
                console.log("Info")
                let res = await mongodbUtils.findAndUpdateDocument(database, collection,
                    { "group_id": data.group_id }, { "_24点.free": false });
                console.log(res);
                return;
            }, 5 * 1 * 1000);
            await mongodbUtils.findAndUpdateDocument(database, collection,
                { "group_id": data.group_id }, { "_24点.free": true });
        }
    }
}
func1(data);

// (async () => {
//     await mongodbUtils.findAndUpdateDocument(database, collection, { "group_id": data.group_id }, {
//         "_24点.free": false
//     })
// })();



