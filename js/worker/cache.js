importScripts('promise-worker.register.min.js');
var cache = new Array;
registerPromiseWorker(function (m) {
    if (m == null) return null;
    if (typeof m === 'number') { if (m < cache.length) { return cache[m]; } else { return null } }
    switch (m) {
        case 'CLEAN': case 'clean': case 'cls': case 'CLS':
            cache = new Array;
            break;
        case 'PRINT': case 'print': case 'log': case 'LOG':
            console.log(cache);
            break;
        default:
            cache.push(m);
            return cache.length - 1;
            break;
    }
    return null;
});