function isIntranet(ip) {
    // 检查是否是内网IP
    // A类地址中: 10.0.0.0 ~ 10.255.255.255.255
    // B类地址中: 172.16.0.0 ~ 172.31.255.255
    // C类地址中: 192.168.0.0 ~ 192.168.255.255
    if (ip === "127.0.0.1" || ip === "localhost") {
        return true;
    }
    let ip_array = ip.split('.');
    //A类
    if (ip_array[0] === "10") {
        return true;
    }
    //C类
    if (ip_array[0] == "192" && ip_array[1] == "168") {
        return true;
    }
    //B类
    if (ip_array[0] == "172") {
        var num = parseInt(ip_array[1]);
        if (num >= 16 && num <= 31) {
            return true;
        }
    }
    return false;
}

let snet = {
    isIntranet,
};

module.exports = snet;