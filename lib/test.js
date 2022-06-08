import { GET } from "./http-utils.js";
import got from "got";
let url1 = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f60e/u1f60e_u1f601.png";
let url2 = "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f601/u1f601_u1f60e.png";
async function aaa() {
    try {
        await got(url1);
        return url1;
    } catch (error) {
        try {
            await got(url2);
            return url2;
        } catch (err) {
            return;
        }
    }
};

(async () => {
    let a = await aaa();
    console.log(a);
})()