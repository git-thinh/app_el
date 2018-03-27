var _cacheSendUI = new Array;
var _cacheSendAPI = new Array;
var _cacheSendAPI = new Array;
var _opend = false;
var _socket = null;

var _portHTTP = 0;

var _speakText = '';

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
        var url = 'http://localhost:' + _portHTTP;

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
    var key = a[0].toString().toUpperCase();
    switch (key) {
        case 'HTTP_PORT':
            if (a.length > 1)
                _portHTTP = Number(a[1]);
            break;
        case 'SPEAK_FAIL':
            _socket.send(_speakText);
            break;
        default:
            self.postMessage(e.data);
            break;
    }
}

/* SPEECH */

self.addEventListener('message', function (e) {
    var data = e.data;
    if (typeof data == 'string') {
        _speakText = data;
        _socket.send(data);
    } else {
        sendMessageHTTP(data);
    }
    //_cacheSendAPI.push(data);
}, false);

/* TIMER */

setInterval(function () {
    if (_cacheSendUI.length > 0) {
        var data = _cacheSendUI[0];
        _cacheSendUI.splice(0, 1);
        self.postMessage(data);
    }
}, 1000);

setInterval(function () {
    if (_opend && _cacheSendAPI.length > 0) {
        var data = _cacheSendAPI[0];
        _cacheSendAPI.splice(0, 1);
        _socket.send(data);
    }
}, 1000);

/* SOCKET */
function _socket_Init() {
    _socket = new WebSocket('ws://localhost:8889');
    _socket.onmessage = function (e) {
        receiveMessageAPI(e.data);
    };
    _socket.onopen = function () {
        _opend = true;
        self.postMessage({ action: 'API_OPEN' });
    };
    _socket.onclose = function () {
        _opend = false;
        self.postMessage({ action: 'API_CLOSE' });
    }
}
_socket_Init();
setInterval(function () {
    if (!_opend) {
        console.log('REOPEN SOCKET .....', new Date().toString());
        _socket_Init();
    }
}, 5000);
