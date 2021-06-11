function formatFloat(value, num, padding=false) {
    let val = Number(value);
    if (num < 0) {
        return String(val);
    }
    val = val.toFixed(num);
    if (!padding) {
        val = parseFloat(val);
    }
    return String(val);
}

/**
 * 修复有精度问题的浮点数
 * @param {Number} num 
 */
function fixFloat(num) {
    let str = String(num);
    if (str.match(/^[+-]?((0\.\d{16,})|([\d\.]{17,}))$/)) {//16位有效数字，多半是由float的精度导致的
        if (str.match(/\.\d*?(0{3,}\d$)/)) {
            str = str.replace(/0{3,}\d$/, '');
            return Number(str);
        }
        if (str.match(/\.\d*?(9{3,}\d$)/)) {
            str = str.replace(/9{3,}\d$/, '');
            str = str.replace(/\d$/, ($0)=>{
                return parseInt($0) + 1;
            });
            let fix = 0;
            if (str.match(/\.$/)) {
                fix = 1;
            }
            return Number(str) + fix;
        }
    }
    return num;
}

/**
 * 比较两个版本的大小
 * @param {String} version1 
 * @param {String} version2 
 * @returns 1: 大于 0: 等于 -1: 小于
 */
function compareVersion(version1, version2) {
    let v1 = version1.split(".");
    let v2 = version2.split(".");
    let length = Math.max(v1.length, v2.length);
    let compare = (i1, i2) => {
        i1 = parseInt(i1);
        i2 = parseInt(i2);
        if (isNaN(i1) && isNaN(i2)) {
            return 0;
        } else if (isNaN(i1)) {
            return -1;
        } else if (isNaN(i2)) {
            return 1;
        } else {
            if (i1 > i2) {
                return 1;
            } else if (i1 < i2) {
                return -1;
            }
            return 0;
        }
    }
    for (let i = 0; i < length; i++) {
        let ret = compare(v1[i], v2[i]);
        if (ret !== 0) {
            return ret;
        }
    }
    return 0;
}

let smath = {
    formatFloat,
    fixFloat,
    compareVersion,
};

module.exports = smath;