import useClipboard from 'vue-clipboard3';

/**
 * @description 复制文本到剪切板
 * @author lecoler
 * @date 2022/11/8
 * @param {String} text - 待复制的文本
 * @return Promise
 */
export function copyText(text) {
    return useClipboard().toClipboard(text);
}

/**
 * @description 字符串截取 前四位 和 后四位
 * @author lecoler
 * @date 2022/9/16
 * @param {String} str - 待处理字符串
 * @param {Number} [firstNum] - 前保留的位数
 * @param {Number} [lastNum] - 后保留的位数
 * @param {Number} [starNum] - *数量
 * @return String
 */
export function textSubstr(str, firstNum = 4, lastNum = 4, starNum = 4) {
    let txt = '';
    if (str) {
        if (str.length <= 8) {
            txt = str;
        } else {
            txt = str.substring(0, firstNum) + Array(starNum).fill('*').join('') + str.substr(str.length - lastNum);
        }
    }
    return txt;
}

/**
 * @description 防抖动
 * @author lecoler
 * @date 2022/9/16
 * @param {String} func - 防抖动后执行函数
 * @param {Number} time - 时间
 * @return Function
 */
export function debounce(func, time) {
    let context, args, timeId, timestamp;

    function timeout() {
        const now = Date.now() - timestamp;
        if (now >= 0 && now < time) {
            timeId = setTimeout(timeout, time - now);
        } else {
            timeId = null;
            func.apply(context, args);
        }
    }

    function action() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        if (!timeId) timeId = setTimeout(timeout, time);
    }

    return action;
}

/**
 * @description 节流
 * @author lecoler
 * @since 2022-10-31
 * @param {function} func - 执行函数
 * @param {number} time -  时间
 * @return function
 */
export function throttle(func, time) {
    let pre = Date.now();
    return function () {
        const context = this;
        const args = arguments;
        const now = Date.now();
        if (now - pre >= time) {
            func.apply(context, args);
            pre = Date.now();
        }
    };
}

/**
 * @description 格式化数字，确保是数字
 * @author lecoler
 * @date 2022/12/14
 * @param {String|Number} value - 数字字符
 * @return String
 */
export function formatNum(value) {
    let tmp = String(value);
    if (tmp.indexOf('.') !== -1) {
        tmp.split('.');
        let a = tmp.split('.')[0];
        let b = tmp.split('.')[1] || '';
        tmp = a.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + b;
    } else {
        tmp = tmp.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
    return tmp;
}

/**
 * @description 保留指定小数位数（截取）
 * @author lecoler
 * @date 2022/12/14
 * @param {String|Number} value - 数字
 * @param {Number} num - 保留位数
 * @return String
 */
export function sliceDecimal(value = 0, num) {
    const reg = new RegExp('^(.*\\..{' + num + '}).*$', 'g');
    const tmp = String(value).replace(reg, '$1');
    if (num <= 0) {
        return tmp.split('.')[0];
    }
    return tmp;
}

/**
 * @description 折叠小数重复0部分同时保留指定折叠后小数位数（截取）
 * @author lecoler
 * @date 2022/12/14
 * @param {String|Number} value - 数字
 * @param {Number} num - 保留位数
 * @return String
 */
export function foldDecimal(value, num) {
    // 确保是0.0开头
    if (String(value).startsWith('0.0')) {
        const val = String(value).replace(/^0\.0{4,}/, match => {
            const zeros = match.length - 2; // 获取连续零的个数
            return `0.0{${zeros}}`;
        });
        // 是否折叠了
        if (val.search('}') !== -1) {
            const tmp = val.split('}');
            return `${tmp[0]}}${tmp[1].slice(0, num)}`;
        } else {
            return sliceDecimal(val, 5);
        }
    } else {
        return sliceDecimal(value, num);
    }
}

/**
 * @description 将数字转化成 万千亿
 * @author lecoler
 * @date 2022/10/31
 * @param {Number} num - 待转化数字
 * @param {Number} point - 保留几位
 * @param {Boolean} isShow - 是否显示单位万和亿
 * @return String
 */
export function tranNumber(num, point = 4, isShow = true) {
    const number = Number(num);
    if (number >= 100000000) {
        return formatNum(sliceDecimal(number / 100000000, point)) + (isShow ? '亿' : '');
    } else if (number >= 10000) {
        return formatNum(sliceDecimal(number / 10000, point)) + (isShow ? '万' : '');
    } else if (number >= 1) {
        return formatNum(sliceDecimal(num, point)) + '';
    } else {
        return foldDecimal(num, point);
    }
}

/**
 * @description 根据模板格式化时间戳
 * @author lecoler
 * @date 2022/12/14
 * @param {String} fmt - 模板格式
 * @param {String|Date|Number} data - 时间戳/时间
 * @return String
 */
export function dateFormat(fmt, data) {
    let date;
    if (data instanceof Date) {
        date = data;
    } else if (String(data).length >= 13) {
        date = new Date(data);
    } else {
        const num = 13 - String(data).length;
        date = new Date(Number(data) * (10 ** num));
    }

    let ret;
    const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
            );
        }
    }
    return fmt;
}

/**
 * @description 显示指定长度数字，不足前面补0
 * @author lecoler
 * @since 2021/1/20
 * @param num{Number|String} 原数字
 * @param len{Number} 指定长度
 * @return String
 */
export function addNumLength(num, len) {
    return (Array(len).join('0') + num).slice(-len);
}

/**
 * @description 获取url中的参数
 * @author qq
 * @date 2023/01/14
 * @param {String} text - 参数名
 * @return string
 */
export function getSearchParams(text) {
    const params = new URL(window.location.href).searchParams
    return params.get(text) || ''
}


/**
 * @Description 图片上传
 * @author lecoler
 * @date 2020/8/20
 * @param img:String 图片文件
 * @return Promise
 */
export function setImagesfile(img) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: "http://192.168.1.19:9029/api/oss/upload",
            filePath: img,
            name: 'file',
            category:"custom",
            success: (uploadFileRes) => {
                const resData = JSON.parse(uploadFileRes.data);
                resolve(resData)
            },
            fail: (err) => {
                reject("上传错误请重试")
            }
        })
    });
}
/**
 * @Description 获取随机数
 * @author lecoler
 * @date 2023/12/25
 * @param min:Number 最小值(包括最小值)
 * @param max:Number 最大值(包括最大值)
 * @return Number
 */
export function getRandom(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}