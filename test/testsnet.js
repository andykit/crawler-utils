var snet = require('../src/utils/snet.js');

var ips = [
    "localhost",
    "127.0.0.1",
    "test",
    "192.168.3.12",
    "10.0.0.2",
    "192.167.23.1",
];
for (let ip of ips) {
    console.log(ip, snet.isIntranet(ip));
}