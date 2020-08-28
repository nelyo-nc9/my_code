

export default function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
 
b64EncodeUnicode('我是很厉害的'); // "5oiR5piv5b6I5Y6J5a6z55qE"