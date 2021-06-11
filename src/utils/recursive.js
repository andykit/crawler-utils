function recursive(obj, func_do, func_in) {
    func_do(obj);
    let objs = func_in(obj);
    if (!objs || objs.length === 0) {
        return;
    }
    for (let i = 0; i < objs.length; i++) {
        recursive(objs[i], func_do, func_in);
    }
}

function recursivePromise(obj, func_do, func_in) {
    let promise = Promise.resolve();
    let ret = func_do(obj);
    if (ret instanceof Promise) {
        promise = ret;
    }
    let objs = func_in(obj);
    if (!objs || objs.length === 0) {
        return promise;
    }
    for (let i = 0; i < objs.length; i++) {
        promise = promise.then(()=>{
            return recursivePromise(objs[i], func_do, func_in);
        });
    }
    return promise;
}

module.exports = {recursive, recursivePromise};