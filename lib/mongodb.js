const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

/**
 * 查询数据并返回符合条件的文档
 * @param {String} database 数据库名称
 * @param {String} collection 数据库集合表单
 * @param {Document} query 用于查找的对象
 * @returns 符合条件的文档
 */
exports.getOneDocument = async function (database, collection, query) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        const document = await myCollection.findOne(query);
        return document;
    } finally {
        await client.close();
    }
}

/**
 * 查询某表单中field对应的值
 * @param {String} database 
 * @param {String} collection 
 * @param {Document} query 
 * @param {string} key 
 * @returns 
 */
exports.getData = async function (database, collection, query, key) {
    let document = await this.getOneDocument(database, collection, query);
    document = Object(document);
    let fields = key.split(".");
    fields.forEach(elem => {
        document = document[elem];
    });
    return document;
}

/**
 * 插入数据
 * @param {String} database 数据库名称
 * @param {String} collection 数据库集合表单
 * @param {Document} document 文档数据
 */
exports.insertDocument = async function (database, collection, document) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        const result = await myCollection.insertOne(document);
        console.log(`已插入文档，_id:${result.insertedId}`);
    } finally {
        await client.close();
    }
}

/**
 * 修改文档数据
 * @param {String} database 数据库名称
 * @param {String} collection 数据库集合表单
 * @param {Document}} filter 选择修改的文档过滤器
 * @param {Document} update 要修改的内容
 */
exports.updateDocument = async function (database, collection, filter, update) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        const updateDoc = { $set: update };
        const result = await myCollection.updateOne(filter, updateDoc);
        console.log(`已更新文档数据`);
    } finally {
        await client.close();
    }
}

/**
 * 查找并更新数据
 * @param {String} database 
 * @param {String} collection 
 * @param {Document} filter 
 * @param {Document} update 
 * @returns 可从lastErrorObject属性中的updatedExisting判断是否存在索引项
 */
exports.findAndUpdateDocument = async function (database, collection, filter, update) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        const updateDoc = { $set: update };
        const result = await myCollection.findOneAndUpdate(filter, updateDoc);
        return result;
    } finally {
        await client.close();
    }
}


/**
 * 删除指定文档
 * @param {String} database 数据库名称
 * @param {String} collection 数据库集合表单
 * @param {Document} filter 选择删除的文档过滤器
 * @returns 是否删除了文件
 */
exports.deleteDocument = async function (database, collection, filter) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        const result = await myCollection.deleteOne(filter);
        if (result.deletedCount === 0) return false;
        return true;
    } finally {
        await client.close();
    }
}

/**
 * 获取数据库中文档里的所有字段名称
 * @param {String} database 
 * @param {String} collection 
 * @returns {Array}
 */
exports.getDataKey = async function (database, collection) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        let doc = await myCollection.findOne({});
        return Object.keys(doc);
    } finally {
        await client.close();
    }
}

/**
 * 为每一条文档添加同一个数据
 * @param {String} database 
 * @param {String} collection 
 * @param {Document} data 要添加的字段
 * @returns 成功|失败
 */
exports.addDataEvery = async function (database, collection, data) {
    try {
        await client.connect();

        const myDatabase = client.db(database);
        const myCollection = myDatabase.collection(collection);

        let result = await myCollection.updateMany({}, { $set: data });
        if (result.modifiedCount === 0) return false;
        return true;
    } finally {
        await client.close();
    }
}