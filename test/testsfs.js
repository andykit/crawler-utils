var sfs = require('../src/utils/sfs.js');

sfs.getFileMd5('./test_zip/t1.txt').then((md5)=>{
    console.log(md5);
});

sfs.compareFileMd5('./test_zip/t1.txt', './test_zip/t2.txt').then((result)=>{
    console.log(result);
});
sfs.compareFileMd5('./test_zip/t2.txt', './test_zip/t3.txt').then((result)=>{
    console.log(result);
});