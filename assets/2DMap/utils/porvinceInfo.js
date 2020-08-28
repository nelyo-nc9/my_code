export const porvinceArr = [
    { name: "anhui", code: 0, adcode: 34 },
    { name: "beijing", code: 1, adcode: 11 },
    { name: "chongqing", code: 2, adcode: 50 },
    { name: "fujian", code: 3, adcode: 35 },
    { name: "gansu", code: 4, adcode: 62 },
    { name: "guangdong", code: 5, adcode: 44 },
    { name: "guangxi", code: 6, adcode: 45 },
    { name: "guizhou", code: 7, adcode: 52 },
    { name: "hainan", code: 8, adcode: 46 },
    { name: "hebei", code: 9, adcode: 13 },
    { name: "heilongjiang", code: 10, adcode: 23 },
    { name: "henan", code: 11, adcode: 41 },
    { name: "hubei", code: 12, adcode: 42 },
    { name: "hunan", code: 13, adcode: 43 },
    { name: "jiangsu", code: 14, adcode: 32 },
    { name: "jiangxi", code: 15, adcode: 36 },
    { name: "jilin", code: 16, adcode: 22 },
    { name: "liaoning", code: 17, adcode: 21 },
    { name: "neimenggu", code: 18, adcode: 15 },
    { name: "ningxia", code: 19, adcode: 64 },
    { name: "qinghai", code: 20, adcode: 63 },
    { name: "shan3xi", code: 21, adcode: 61 },
    { name: "shandong", code: 22, adcode: 37 },
    { name: "shanghai", code: 23, adcode: 31 },
    { name: "shanxi", code: 24, adcode: 14 },
    { name: "sichuan", code: 25, adcode: 51 },
    { name: "tianjin", code: 26, adcode: 12 },
    { name: "xinjiang", code: 27, adcode: 65 },
    { name: "xizang", code: 28, adcode: 54 },
    { name: "yunnan", code: 29, adcode: 53 },
    { name: "zhejiang", code: 30, adcode: 33 }];



export function getPorvinceInfoByAdcode(adcode) {
    let obj;
    porvinceArr.forEach(item => {
        obj = item.adcode === Number(adcode) ? item : obj;
    });
    return obj;
}





