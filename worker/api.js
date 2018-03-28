var _APP_LOADED = false;
/* SOCKET */
var _SOCKET_OPEN = false, ws = null;
/* STORE DB */
var _GRAM_READY = false, _db_word_gram, _db_gram, _db_dic;
/* SPEECH */
var _speak_text = '';
var _port_http = 0;

/****************************************/
/* SOCKET */

setInterval(function () {
    if (!_SOCKET_OPEN) {
        console.log('REOPEN SOCKET .....', new Date().toString());
        f_socket_Init();
    }
}, 5000);

function f_socket_Init() {
    ws = new WebSocket('ws://localhost:8889');
    ws.onmessage = on_message_websocket;
    ws.onopen = function () {
        _SOCKET_OPEN = true;
        if (_APP_LOADED) {
            f_api_ReOpen();
        } else {
            _APP_LOADED = true;
            f_api_Open();
        }
    };
    ws.onclose = function () {
        _SOCKET_OPEN = false;
        f_api_Close();
    }
}

function f_socket_Send(msg) {
    if (_SOCKET_OPEN == true) {
        var text = '';
        if (typeof msg === 'string') { text = msg; }
        else { text = JSON.stringify(msg); }
        if (text != '' && text.trim().length > 0) { ws.send(text); }
        console.log('SOCKET_SEND', msg);
    }
}

/****************************************/
/* STORE DB */
_db_word_gram = localforage.createInstance({ name: "WORD_GRAM" });
_db_gram = localforage.createInstance({ name: "GRAM" });
_db_dic = localforage.createInstance({ name: "DIC" });

//_db_gram.iterate(function (it, key, iterationNumber) {
//    Array.from(it.KeyWord).forEach(function (word) { _db_word_gram.setItem(word, key); });
//}).then(function () {
//    _GRAM_READY = true;
//}).catch(function (err) { });

function f_db_Query(m) {
    if (!_GRAM_READY && !_SOCKET_OPEN) {
        m.msg = 'System connecting service...!'
        return;
    }

    switch (m.action) {
        case 'USER_LOGIN':
            var u = m.input;
            if (u == null || u.password != 'admin') {
                setTimeout(function () {
                    m.ok = false;
                    m.result = 'Please input correct username and password.';
                    self.postMessage(m);
                }, 500);
            } else {
                setTimeout(function () {
                    m.ok = true;
                    m.result = m.input;
                    self.postMessage(m);
                }, 500);
            }
            break;
        case 'GRAM_ALL_KEY':
            _db_gram.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case 'GRAM_ALL_WORD':
            _db_word_gram.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case 'GRAM_DETAIL_BY_KEY':
            _db_gram.getItem(m.id).then(function (value) {
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

/****************************************/
/* Receive message from UI */
var on_message_ui = function (e) {
    var it = e.data;
    if (typeof it == 'string' && _SOCKET_OPEN) {
        _speak_text = it;
        f_socket_Send(it);
    } else {
        it.ok = false;
        f_db_Query(it);
    }
}

/* Receive message from WebSocket */
var on_message_websocket = function (e) {
    var data = e.data;
    var a = data.split(':');
    var key = a[0].toString().toUpperCase(), s = '';
    switch (key) {
        case 'GRAMMAR_LOAD':
            if (a.length > 1) {
                s = data.substring(key.length + 1, data.length);
                var json = JSON.parse(s);
                _db_gram.length().then(function (_numberOfKeys) {
                    if (_numberOfKeys != json.length) {
                        Array.from(json).forEach(function (it) {
                            _db_gram.setItem(it.Type, it);
                            Array.from(it.KeyWord).forEach(function (word) { _db_word_gram.setItem(word, it.Type); });
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
            break;
        case 'HTTP_PORT':
            if (a.length > 1)
                _port_http = Number(a[1]);
            break;
        case 'SPEAK_FAIL':
            _socket.send(_speak_Text);
            break;
        default:
            self.postMessage(data);
            break;
    }
}

/* Start service after running store DB */
f_socket_Init();

/* post message for UI when websocket reopen */
function f_api_ReOpen() { 
    self.postMessage({ ok: true, callback: 'api.f_reopen' });
}

/* start services for UI when websocket open */
function f_api_Open() {
    f_socket_Send('GRAMMAR_LOAD');
    self.postMessage({ ok: true, callback: 'api.f_open' });
}

/* post message for UI when websocket close */
function f_api_Close() {
    self.postMessage({ ok: true, callback: 'api.f_close' });
}