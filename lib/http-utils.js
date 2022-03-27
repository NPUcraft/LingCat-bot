import got from "got";

/**
 * 基于got库的get请求
 * @param {string} url 请求地址
 * @param {object} options 选项
 * @returns 返回请求头和请求数据
 */
async function GET(url) {
    try {
        let http = await got(url);
        return { "headers": http.headers, "data": JSON.parse(http.body) };
    } catch (error) {
        return null;
    }
}

export { GET };