const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function mkdirsSync(dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dir))) {
            fs.mkdirSync(dir);
            return true;
        }
    }
}

function copyDirSync(src_dir, dst_dir) {
    if (!fs.existsSync(dst_dir)) {
        mkdirsSync(dst_dir);
    }
    let files = fs.readdirSync(src_dir);
    files.forEach((file)=>{
        let file_path1 = path.join(src_dir, file);
        let file_path2 = path.join(dst_dir, file);
        let stat = fs.statSync(file_path1);
        if (stat.isDirectory()) {
            copyDirSync(file_path1, file_path2);
        } else {
            fs.writeFileSync(file_path2, fs.readFileSync(file_path1));
        }
    });
}

function deleteDirSync(dir) {
    if (fs.existsSync(dir)) {
        let files = fs.readdirSync(dir);
        files.forEach((file) => {
            let file_path = path.join(dir, file);
            let stat = fs.statSync(file_path);
            if (stat.isDirectory()) {
                deleteDirSync(file_path);
            } else {
                fs.unlinkSync(file_path);
            }
        });
        fs.rmdirSync(dir);
    }
}

function getFileMd5(file_path) {
    return new Promise((resolve)=>{
        let md5sum = crypto.createHash('md5');
        let stream = fs.createReadStream(file_path);
        stream
            .on('data', function(chunk) {
                md5sum.update(chunk);
            })
            .on('end', function() {
                let md5 = md5sum.digest('hex');
                resolve(md5);
            })
    });
}

function compareFileMd5(file_path1, file_path2) {
    return Promise.all([
        getFileMd5(file_path1),
        getFileMd5(file_path2),
    ]).then((values)=>{
        return values[0] === values[1];
    });
}

let sfs = {
    mkdirsSync,
    copyDirSync,
    deleteDirSync,
    getFileMd5,
    compareFileMd5,
};

module.exports = sfs;