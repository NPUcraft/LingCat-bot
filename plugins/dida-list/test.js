let a = "aseinvi";
let b = "asdwew vse 0210 asdf as"
console.log(getCurrentIdStr())


function getCurrentIdStr() {
    return (PrefixInteger(new Date().getFullYear(), 2)
        + PrefixInteger(new Date().getMonth() + 1, 2) + PrefixInteger(new Date().getDate(), 2)
        + PrefixInteger(new Date().getHours(), 2) + PrefixInteger(new Date().getMinutes(), 2));
    function PrefixInteger(num, m) {
        return (Array(m).join(0) + num).slice(-m);
    }
}