const sfs = require('./sfs.js');
const fs = require('fs');
const os = require('os');
const path = require('path');
const chardet = require('chardet');
const iconv = require('iconv-lite')
const yauzl = require("yauzl");
const JSZip = require("jszip");
const crypto = require('crypto');

function jszipAdd(zip, file_path, contains_dir=false) {
    let stat = fs.statSync(file_path);
    if (!stat.isDirectory()) {
        let file = path.basename(file_path);
        zip.file(file, fs.createReadStream(file_path));
    } else {
        let dir = path.basename(file_path);
        if (contains_dir) {
            zip.folder(dir);
        }
        let files = fs.readdirSync(file_path);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (/^\./.test(file)) {
                continue;
            }
            let sub_file_path = path.join(file_path, file);
            if(contains_dir) {
                jszipAdd(zip.folder(dir), sub_file_path, true);
            } else {
                jszipAdd(zip, sub_file_path, true);
            }
        }
    }
}

function zip(file_path, zip_file, need_md5=false) {
    let zip = new JSZip();
    jszipAdd(zip, file_path);
    let tmp_file = path.join(os.tmpdir(), Date.now()+'.tmp');
    let md5sum = crypto.createHash('md5');
    return new Promise((resolve, reject) => {
        zip.generateNodeStream({streamFiles: true})
            .on('data', (chunk)=>{
                if(need_md5){
                    md5sum.update(chunk);
                }
            })
            .pipe(fs.createWriteStream(tmp_file))
            .on('error', (error)=>{
                reject(error);
            })
            .on('finish', ()=>{
                fs.copyFile(tmp_file, zip_file, (error)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    fs.unlink(tmp_file, () => {
                        if(need_md5){
                            let file_md5 = md5sum.digest('hex');
                            resolve(file_md5);
                        }else{
                            resolve();
                        }
                    })
                })
            });
    });
}

function unzip(zip_file, extract_dir) {
    sfs.mkdirsSync(extract_dir);
    return new Promise((resolve, reject)=>{
        let promises = [];
        yauzl.open(zip_file, {lazyEntries:true, decodeStrings:false}, function(err, zipfile) {
            if (err) {
                reject(err);
                return;
            }
            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                let name;
                if(chardet.detect(entry.fileName) == "UTF-8") {
                    name = iconv.decode(entry.fileName, 'utf8');
                }else{
                    name = iconv.decode(entry.fileName, 'gbk');
                }
                entry.fileName = name;
                if (/\/$/.test(entry.fileName)) {
                    if(!fs.existsSync(path.join(extract_dir,entry.fileName))){
                        fs.mkdirSync(path.join(extract_dir,entry.fileName));
                    }
                    zipfile.readEntry();
                } else {
                    zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        let promise = new Promise((resolve)=>{
                            let ws = fs.createWriteStream(path.join(extract_dir,entry.fileName));
                            readStream.pipe(ws);
                            ws.on("finish", function(){
                                zipfile.readEntry();
                                resolve();
                            }).on("error", function(err){
                                reject(err);
                            })
                        })
                        promises.push(promise);
                    });
                }
            }).on("close",function(){
                Promise.all(promises).then(resolve);
            });
        });
    });
}

let szip = {
    unzip,
    zip,
};

module.exports = szip;