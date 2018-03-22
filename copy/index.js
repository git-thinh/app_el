// Perform the install step:
// * Load a JSON file from server
// * Parse as JSON
// * Add files to the cache list

var _CACHE_STORE = 'CACHE_STORE';
var _CACHE_FILE = 'cache.json';

function init_Page() {
    // We switch between production and testing environments by checking the hash of the URL.
    window.onhashchange = function () {
        var newHash = window.location.hash.substr(1);
        var cacheHash = localStorage['module_code'];
        console.log('newHash = ' + newHash + '| currentHash = ' + cacheHash);

        if (newHash == null || newHash == '') {
            //window.location.hash = 'admin';
            //localStorage['module_code'] = newHash;
            //window.location.reload();
        } else {
            if (newHash != cacheHash) {
                localStorage['module_code'] = newHash;
                //window.location.reload();
            }
        }
    };

    // Force the initial check.
    window.onhashchange();
}

function init_Cache() {
    if ('caches' in window) {
        // Clean cache store space
        //caches.keys().then(function (names) {
        //    if (names.length > 0) {
        //        for (let name of names) {
        //            console.log('[INDEX.JS] Clean cache store: ' + name);
        //            caches.delete(name);
        //        }
        //        alert('Reload after delete outdated caches');
        //        return true;
        //    }
        //    return false;
        //});

        //caches.open(_CACHE_STORE).then(function (cache) {
        //    console.log('[INDEX.JS] Set cache file: /index.html');
        //    cache.add('/index.html');
        //});

        // Set cache again via file cache.json
        caches.open(_CACHE_STORE)
            .then(function (cache) {
                // With the cache opened, load a JSON file containing an array of files to be cached
                return fetch(_CACHE_FILE).then(function (response) {
                    // Once the contents are loaded, convert the raw text to a JavaScript object
                    return response.json();
                }).then(function (files) {
                    // Use cache.addAll just as you would a hardcoded array of items
                    console.log('[INDEX-CACHE] Set file: ', files);
                    return cache.addAll(files);
                });
            })
            .then(function () {
                // Message to simply show the lifecycle flow
                console.log('[INDEX-CACHE] All required resources have been cached');

                // Force activation
                //return self.skipWaiting();
                init_Page();
            });;
    } // end cache
}

function init_Worker() {
    // Once the Service Worker is activated, init()
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function (registration) {
            if (!registration) {
                console.log('[INDEX-WORKER] The application did not install service worker');

                //navigator.serviceWorker.register('worker.js', { scope: '.' });
                //navigator.serviceWorker.ready.then(function () {
                //    console.log('[INDEX-CACHE] The Service Worker was successfully installed!');
                //    init_Cache();
                //});
                return;
            }

            registration.unregister().then(function () {
                console.log('[INDEX-WORKER] The application has been uninstalled service worker');
                //setTimeout(function () { location.reload(); }, 100);
            }).catch(function (error) {
                console.log('[INDEX-WORKER] Error while uninstalling the service worker:');
                console.log(error.message);
            });
        });
    }
}

init_Worker();