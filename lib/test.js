const te = require("./permission");
const mongodbUtils = require("./mongodb");

// te.getPermission(data, "_24points")
// (async () => {
//     let doc;
//     let data = { "group_id": 1234567 };
//     const database = "TestDB";
//     const collection = "Permission";
//     doc = await mongodbUtils.getOneDocument(database, collection, { "group_id": data.group_id });
//     console.log(doc["_24points"]);
// })();
// const database = "TestDB";
// const collection = "Permission";
// let filter = { "group_id": 710085830 };
// let name = "_24points";
// filter[(name + ".exists")] = true;

// let document = {};
// document[(name + ".activation")] = false;
// mongodbUtils.findAndUpdateDocument(database, collection, filter, document)
data = {
    "group_id": 710085830,
    "banned": false,
    "_24点": {
        "exists": true,
        "activation": true,
        "level": 1
    },
    "sender": {
        "role": "admin"
    }
};
let res;
const { getPermission } = require("./permission");
(async () => {
    res = await getPermission(data, "24点");
    console.log(res)
})();

