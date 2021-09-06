let s = {
    "d": 234,
    "dd": 123,
    "q": 1232,
};
let sd = [];
let ss = s.map(x => { for (const x in s) sd.pop(x) })
console.log(ss)