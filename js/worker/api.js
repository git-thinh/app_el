importScripts('promise-worker.register.min.js', 'localforage.min.js', 'underscore.min.js');

var cache = new Array;
var api = {
    on_worker_receiver: function (m) {
        if (m == null) return null;
        if (typeof m === 'number') return api.cache.f_get(m);
        if (typeof m === 'string' && m.indexOf('http') == 0) {
            return fetch(m).then(function (response) {
                console.log(response.headers.get('Content-Type'));
                console.log(response.headers.get('Date'));

                console.log(response.status);
                console.log(response.statusText);
                console.log(response.type);
                console.log(response.url);
            });
        }
        return null;
    },
    cache: {
        f_get: function (m) {
            if (m < cache.length) { return cache[m]; } else { return null } 
        },
        f_set: function (m) {
            if (m < cache.length) { return cache[m]; } else { return null } 
            switch (m) {
                case 'clean': case 'cls':
                    cache = new Array;
                    break;
                case 'print': case 'log': case 'cache':
                    console.log(cache);
                    break;
                default:
                    cache.push(m);
                    return cache.length - 1;
                    break;
            }
        }
    }
};
registerPromiseWorker(api.on_worker_receiver);