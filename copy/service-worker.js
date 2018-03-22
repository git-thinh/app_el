importScripts('./assets/js/ServiceWorkerWare.js');

var _CACHE_STORE = 'CACHE_STORE';
var _USER = null;

function user_Login() {
    if (_USER != null && _USER['login'] == true) return true;
    return false;
}
function loadJson(url) {
    return fetch(url)
      .then(response => response.json());
}

function loadText(url) {
    return fetch(url)
      .then(response => response.text());
}

// Determine the root for the routes. I.e, if the Service Worker URL is
// `http://example.com/path/to/sw.js`, then the root is
// `http://example.com/path/to/`
var _ROOT = (function () {
    var tokens = (self.location + '').split('/');
    tokens[tokens.length - 1] = '';
    return tokens.join('/');
})();
console.log(_ROOT);

//https://github.com/fxos-components/serviceworkerware
var _WORKER = new ServiceWorkerWare();

_WORKER.get(_ROOT + '/module/*', function (request, response) {
    return Promise.resolve(new Response('Hello world!', { headers: { 'Content-Type': 'text/plain' } }));
});

_WORKER.get(_ROOT, function (req, res) {
    var _response = null;
    //if (user_Login()) {
    //    _response = fetch(_ROOT + '/module/admin.html', { method: 'GET', cache: 'default' })
    //        .then(function (_res) {
    //            var init = {
    //                status: _res.status,
    //                statusText: _res.statusText,
    //                headers: { 'X-Foo': 'My Custom Header' }
    //            };

    //            _res.headers.forEach(function (v, k) {
    //                init.headers[k] = v;
    //            });

    //            return _res.text().then(function (_htm) {
    //                return new Response(_htm, init);
    //            });
    //        });
    //} else {
    //    _response = fetch(_ROOT + '/module/admin.html', { method: 'GET', cache: 'default' })
    //        .then(function (_res) {
    //            // http://127.0.0.1:8888/?model=&action=file_browser&ext=html&path=C:\nginx\admin\module
    //            var init = {
    //                status: _res.status,
    //                statusText: _res.statusText,
    //                headers: { 'X-Foo': 'My Custom Header' }
    //            };

    //            _res.headers.forEach(function (v, k) {
    //                init.headers[k] = v;
    //            });

    //            return _res.text().then(function (_htm) {
    //                return new Response(_htm, init);
    //            });
    //        });
    //}

    //loadJson('http://127.0.0.1:8888/?model=&action=file_browser&ext=html&path=C:\nginx\admin\module').then(function (_json) {
    //    loadText(_ROOT + '/module/admin.html').then(function (_htm) {

    //        // Use custom template delimiters.
    //        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    //        var compiled = _.template('hello {{ user }}!');
    //        compiled({ 'user': 'mustache' });
    //        // => 'hello mustache!'

    //    });
    //});


    return _response;
});

_WORKER.init();

////////////////////////////////////////////////

//// On fetch, use cache but update the entry with the latest contents from the server.
//self.addEventListener('fetch', function (evt) {
//    console.log('The service worker is serving the asset.');
//    // Try network and if it fails, go for the cached copy.
//    evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
//        return fromCache(evt.request);
//    }));
//});

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        // Reject in case of timeout.
        var timeoutId = setTimeout(reject, timeout);
        // Fulfill in case of success.
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
            // Reject also if network fetch rejects.
        }, reject);
    });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

////////////////////////////////////////////////

function msg_GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function msg_BroadCast(_data) {
    var _msg = new Date(); 
    self.clients.matchAll()
        .then(function (clientList) {
            clientList.forEach(function (_client) {
                _client.postMessage({ client: _client.id, message: _msg });
            });
        });
}

function msg_sendCallback(_callback, _data, _after_get_remove) {
    var _idCache = '';
    var _msg = JSON.stringify({
        type: '',
        name: _callback,
        result: _idCache,
        after_get_remove: _after_get_remove
    });

    self.clients.matchAll()
        .then(function (clientList) {
            clientList.forEach(function (_client) {
                _client.postMessage({ client: _client.id, message: _msg });
            });
        });
}

// Listen for messages from clients.
self.addEventListener('message', function (event) {
    // Get all the connected clients and forward the message along.
    var promise = self.clients.matchAll()
        .then(function (clientList) {
            // event.source.id contains the ID of the sender of the message.
            var senderID = event.source.id;

            clientList.forEach(function (client) {
                // Skip sending the message to the client that sent it.
                if (client.id === senderID) {
                    return;
                }
                client.postMessage({
                    client: senderID,
                    message: event.data
                });
            });
        });

    // If event.waitUntil is defined, use it to extend the
    // lifetime of the Service Worker.
    if (event.waitUntil) {
        event.waitUntil(promise);
    }
});

self.addEventListener('install', function (event) {
    // Message to simply show the lifecycle flow
    console.log('[WORKER-INSTALL] Kicking off service worker registration!');

    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {

    setInterval(function () {
        msg_BroadCast('123');
    }, 5000);

    // Message to simply show the lifecycle flow
    console.log('[WORKER-ACTIVATE] Activating service worker!');

    // Claim the service work for this client, forcing `controllerchange` event
    //console.log('[WORKER-ACTIVATE] Claiming this service worker!');
    //event.waitUntil(self.clients.claim());

    console.log('[WORKER-ACTIVATE] Delete outdated caches');
    // Use this to delete outdated caches
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.filter(function (cacheName) {
                // Return true if you want to remove this cache,
                // but remember that caches are shared across
                // the whole origin
            }).map(function (cacheName) {
                console.log('[activate] Clean cache file: ' + cacheName);
                return caches.delete(cacheName);
            })
        );
    }));// end event
});


////self.addEventListener('fetch', function (event) {
////    var url = event.request.url;
////    var host = url.split('/')[2];
////    console.log('[WORKER-FETCH-URL] = ' + url);

////    //////if (url.indexOf('/module/') != -1) {
////    //////    // Prevent the default, and handle the request ourselves.
////    //////    event.respondWith(async function () {
////    //////        // Try to get the response from a cache.
////    //////        const cache = await caches.open(_CACHE_STORE);
////    //////        const cachedResponse = await cache.match(event.request);

////    //////        debugger;

////    //////        if (cachedResponse) {
////    //////            // If we found a match in the cache, return it, but also
////    //////            // update the entry in the cache in the background.
////    //////            event.waitUntil(cache.add(event.request));
////    //////            return cachedResponse;
////    //////        }

////    //////        // If we didn't find a match in the cache, use the network.
////    //////        return fetch(event.request);
////    //////    }());
////    //////}
////    //////else

////    if (url.endsWith(host + '/')) {
////        var url_htm = url + 'module/admin.html';
////        console.log('[WORKER-FETCH] get: ', url_htm);
////        //event.respondWith(fetch(url_new, { method: 'GET', cache: 'default' }));

////        //var f1 = fetch(url_new, { method: 'GET', cache: 'default' })
////        //    .then(res => res.text())
////        //    .catch(error => error.toString())
////        //    //.then(response => console.log('Success:', response));

////        //var t1;
////        //Promise.all([f1]).then(function (values) {
////        //    t1 = values[0];
////        //});

////        //////// Try to get the response from a cache.
////        //////const cache = await caches.open(_CACHE_STORE);
////        //////const cachedResponse = await cache.match(event.request);
////        //////const res = cachedResponse.text().then(function (body) {

////        //////    return new Response(body + "Foo Bar", {
////        //////        status: 200,
////        //////        statusText: "OK",
////        //////        headers: { 'Content-Type': 'text/html' }
////        //////    });
////        //////});

////        //////if (cachedResponse) {
////        //////    // If we found a match in the cache, return it, but also
////        //////    // update the entry in the cache in the background.
////        //////    event.waitUntil(cache.add(event.request));
////        //////    //return cachedResponse;           
////        //////}

////        //////event.respondWith(new Response(t1, {
////        //////    headers: { 'content-type': 'text/html' }
////        //////}));

////        debugger;

////        var _htm = '';

////        event.respondWith(new Response(_htm + "Foo Bar", { status: 200, statusText: '', headers: { 'X-Foo': 'My Custom Header' } }));

////        ////event.respondWith(
////        ////    fetch(url_new, { method: 'GET', cache: 'default' }).then(function (_res) {
////        ////        var init = {
////        ////            status: _res.status,
////        ////            statusText: _res.statusText,
////        ////            headers: { 'X-Foo': 'My Custom Header' }
////        ////        };

////        ////        _res.headers.forEach(function (v, k) {
////        ////            init.headers[k] = v;
////        ////        });

////        ////        return _res.text().then(function (body) {
////        ////            console.log(url_new, body);
////        ////            debugger;
////        ////            return new Response(body + "Foo Bar", init);
////        ////        });
////        ////    })
////        ////);

////    }
////    else if (url.includes('/#')) {
////        console.log('[WORKER-FETCH] get online: ', url);
////        var url_module = url.split('/#').join('/module/') + '.html';
////        console.log('[WORKER-FETCH] get module: ', url_module);
////        event.respondWith(fetch(url_module, { method: 'GET', cache: 'default' }));
////    } else {
////        event.respondWith(
////            caches.match(event.request)
////                .then(function (response) {
////                    // Cache hit - return the response from the cached version
////                    if (response) {
////                        console.log('[WORKER-FETCH] get cache: ', event.request.url);
////                        return response;
////                    }

////                    // Not in cache - return the result from the live server
////                    // `fetch` is essentially a "fallback"
////                    console.log('[WORKER-FETCH] get online: ', event.request.url);
////                    return fetch(event.request);
////                })
////        );
////    }
////});

