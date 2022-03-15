//获取地址query参数
function getQueryString(name){
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let r = window.location.search.substr(1).match(reg)
    if( r !== null){
        return decodeURI(r[2])
    }else{
        return ''
    }
}

//判断用户是否拥有某项权利，本地无此逻辑，默认为true
function hasAuthority(){
    return true
}
function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let raw = ''
    if(parts.length>1){
        raw = window.atob(parts[1]);
    }else{
        raw = window.atob(parts[0]);
    }

    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array]);
}

function blobToBase64(file){
    return new Promise((resolve,reject)=>{
        let reader = new FileReader();
        reader.onload = function(event){
            resolve(event.target.result)
        }
        reader.readAsDataURL(file)
    })
}

//防抖
function debounce(fn, delay = 500) {
    let timer = null;
    return function () {
        let args = arguments;
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
//节流
function throttle(fn, interval = 500) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (!timer) {
            timer = window.setTimeout(() => {
                fn.apply(context, args)
                timer = null
            }, interval)
        }
    }
}

//深拷贝
const deepClone = function (source) {
    if (!source || typeof source !== "object") {
        throw new Error("error arguments", "shallowClone");
    }
    var targetObj = source.constructor === Array ? [] : {};
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === "object") {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}

export {
    getQueryString,
    hasAuthority,
    base64ToBlob,
    blobToBase64,
    debounce,
    throttle,
    deepClone,
}
