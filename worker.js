importScripts('localforage.min.js');

var GRAM_READY = false;
var SOCKET_OPEN = false;

var _socket = null;
var _port_HTTP = 0;
var _speak_Text = '';

var _wordGramStore = localforage.createInstance({ name: "WORD_GRAM" });
var _gramStore = localforage.createInstance({ name: "GRAM" });
var _dicStore = localforage.createInstance({ name: "DIC" });

_gramStore.iterate(function (_it, _key, iterationNumber) {
    Array.from(_it.KeyWord).forEach(function (_id) { _wordGramStore.setItem(_id, _key); });
}).then(function () {
    GRAM_READY = true;
}).catch(function (err) { });

_socket_Init();
self.onmessage = function (e) { var it = e.data; if (typeof it == 'string' && SOCKET_OPEN) { _speak_Text = it; _socket.send(it); } else { it.ok = false; _message_Query(it); } };

function _message_Query(m) {
    if (!GRAM_READY && !SOCKET_OPEN) {
        m.msg = 'System connecting service...!'
        return;
    }

    switch (m.action) {
        case 'GRAM_ALL_KEY':
            _gramStore.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case 'GRAM_ALL_WORD':
            _wordGramStore.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case 'GRAM_DETAIL_BY_KEY':
            _gramStore.getItem(m.id).then(function (value) {
                m.ok = true;
                m.result = value;
                self.postMessage(m);
            }).catch(function (err) {
                m.msg = 'Cannot find item has key is: ' + m.id;
                self.postMessage(m);
            });
            break;
    }
}








function sendMessageHTTP(obj) {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    obj['id'] = id;
    sessionStorage[id];
    caches.open('CACHE').then(function (cache) {
        cache.put(id, obj);

        console.log(id);
        var url = 'http://localhost:' + _port_HTTP;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                // Request finished. Do processing here.
                var result = xhr.responseText;
                cache.put(id + '.result', result);
                self.postMessage('API:' + id);
            }
        }
        xhr.send(obj);
        //xhr.send("foo=bar&lorem=ipsum");
        // xhr.send('string'); 
        // xhr.send(new Blob()); 
        // xhr.send(new Int8Array()); 
        // xhr.send({ form: 'data' }); 
        // xhr.send(document);
    });
}

function receiveMessageAPI(data) {
    var a = data.split(':');
    var key = a[0].toString().toUpperCase(), s = '';
    switch (key) {
        case 'GRAMMAR_LOAD':
            if (a.length > 1) {
                s = data.substring(key.length + 1, data.length);
                var json = JSON.parse(s);
                _gramStore.length().then(function (_numberOfKeys) {
                    if (_numberOfKeys != json.length) {
                        Array.from(json).forEach(function (_it) {
                            _gramStore.setItem(_it.Type, _it);
                            Array.from(_it.KeyWord).forEach(function (_id) { _wordGramStore.setItem(_id, _it.Type); });
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
            break;
        case 'HTTP_PORT':
            if (a.length > 1)
                _port_HTTP = Number(a[1]);
            break;
        case 'SPEAK_FAIL':
            _socket.send(_speak_Text);
            break;
        default:
            self.postMessage(data);
            break;
    }
}

/* SPEECH */

//self.addEventListener('message', function (e) {
//    var data = e.data;
//    if (typeof data == 'string') {
//        _speak_Text = data;
//        _socket.send(data);
//    } else {
//        sendMessageHTTP(data);
//    }
//    //_cacheSendAPI.push(data);
//}, false);

/* SOCKET */
function _socket_Init() {
    _socket = new WebSocket('ws://localhost:8889');
    _socket.onmessage = function (e) {
        receiveMessageAPI(e.data);
    };
    _socket.onopen = function () {
        SOCKET_OPEN = true;
        _socket.send('GRAMMAR_LOAD');
        self.postMessage({ ok: true, callback: 'SYSTEM_READY' });
    };
    _socket.onclose = function () {
        SOCKET_OPEN = false;
        self.postMessage({ action: 'API_CLOSE' });
    }
}

setInterval(function () {
    if (!SOCKET_OPEN) {
        console.log('REOPEN SOCKET .....', new Date().toString());
        _socket_Init();
    }
}, 5000);
