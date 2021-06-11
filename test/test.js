let recursive = require('../src/utils/recursive.js');

let objs = {
    option: "option1",
    sub_objs: [
        {
            option: "option2"
        },
        {
            option: "option3",
            sub_objs: [
                {
                    option: "option4"
                },
                {
                    option: "option5"
                }
            ]
        }
    ]
};

function test() {
    recursive(objs, (obj)=>{
        if (obj.option === 'option3') {
            console.log("sleep 1s");
            setTimeout(()=>{
                console.log(obj.option);
            }, 1000);
        } else {
            console.log(obj.option);
        }
    }, (obj)=>{
        return obj.sub_objs;
    });
}

function testPromise() {
    recursive(objs, (obj)=>{
        return new Promise((resolve)=>{
            if (obj.option === 'option3') {
                console.log("sleep 1s");
                setTimeout(()=>{
                    console.log(obj.option);
                    resolve();
                }, 1000);
            } else {
                console.log(obj.option);
                resolve();
            }
        });
    }, (obj)=>{
        return obj.sub_objs;
    }).then(()=>{
        console.log("recursive done");
    });
}

// test();
testPromise();