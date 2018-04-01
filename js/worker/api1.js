var _APP_LOADED = false;
var _split_key = '¦';
var _split_data = '‖';
var _path_root = 'C:/nginx/app_el_sys/bin/Debug/english';
/* SOCKET */
var _SOCKET_OPEN = false, ws = null;
/* STORE DB */
var _GRAM_READY = false, _db_word_gram, _db_gram, _db_dic;
/* SPEECH */
var _speak_text = '';
var _port_http = 0;

var _action_key = {
    FILE_LOAD: 'FILE_LOAD',
    TREE_NODE: 'TREE_NODE',
    USER_LOGIN: 'USER_LOGIN',
    GRAM_ALL_KEY: 'GRAM_ALL_KEY',
    GRAM_ALL_WORD: 'GRAM_ALL_WORD',
    GRAM_DETAIL_BY_KEY: 'GRAM_DETAIL_BY_KEY',
};
var _cache_request = {};
var _cache_ui = {};

function f_create_key(arr) {
    var s = '';
    if (arr !== null && arr.length > 0) { s = arr.join(_split_key); }
    return s;
}

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
        console.log('SOCKET -> API: ', msg);
    }
}

/****************************************/
/* STORE DB */
_db_word_gram = localforage.createInstance({ name: "WORD_GRAM" });
_db_gram = localforage.createInstance({ name: "GRAM" });
_db_dic = localforage.createInstance({ name: "DIC" });
_db_article = localforage.createInstance({ name: "ARTICLE" });

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

    var input = m.input, key, result_type;

    switch (m.action) {
        case _action_key.FILE_LOAD:
            if (input != null) {
                result_type = 'html';
                key = f_create_key([m.action, input.name, result_type]);
                m.result_type = result_type;
                m.cache_key = key;
                _cache_request[key] = m;

                result_type = 'word';
                var key2 = f_create_key([m.action, input.name, result_type]);
                var m2 = _.clone(m);
                m2.result_type = result_type;
                m2.cache_key = key2;
                _cache_request[key2] = m2;

                result_type = 'text';
                var key3 = f_create_key([m.action, input.name, result_type]);
                var m3 = _.clone(m);
                m3.result_type = result_type;
                m3.cache_key = key3;
                _cache_request[key3] = m3;

                _db_article.getItem(key, function (err, value) {
                    if (value == null) {
                        f_socket_Send(key);
                    } else {
                        m.result = value.result;
                        console.log('CACHE.HTML: ', m);
                        self.postMessage(m);
                        _db_article.getItem(key2, function (err2, value2) {
                            if (value2 != null) {
                                m2.result = value2.result;
                                console.log('CACHE.WORD: ', m2);
                                self.postMessage(m2);
                            }
                        });
                        _db_article.getItem(key3, function (err3, value3) {
                            if (value3 != null) {
                                m3.result = value3.result;
                                console.log('CACHE.TEXT: ', m3);
                                self.postMessage(m3);
                            }
                        });
                    }
                });
            }
            break;
        case _action_key.TREE_NODE:
            if (input.folder != null && input.path != null) {
                key = f_create_key([m.action, input.path, input.folder]);
                m.cache_key = key;
                _cache_request[key] = m;
                f_socket_Send(key);
            }

            //setTimeout(function () {
            //    m.ok = true;
            //    m.result = {
            //        path: _path_root,
            //        dirs: [
            //            { name: 'folder 1', count: 0 },
            //            { name: 'folder 2', count: 3 },
            //            { name: 'folder 3', count: 5 },
            //            { name: 'folder 4', count: 0 },
            //            { name: 'folder 5', count: 3 },
            //            { name: 'folder 6', count: 9 },
            //            { name: 'folder 7', count: 7 },
            //            { name: 'folder 8', count: 99 }
            //        ],
            //        files: [
            //            { name: 'file1.txt', title: 'file 1', type: 'article' },
            //            { name: 'file2.txt', title: 'file 2', type: 'article' },
            //            { name: 'file3.txt', title: 'file 3', type: 'grammar' },
            //            { name: 'file4.txt', title: 'file 4', type: 'article' },
            //            { name: 'file5.txt', title: 'file 5', type: 'grammar' },
            //            { name: 'file6.txt', title: 'file 6', type: 'article' }
            //        ]
            //    };
            //    self.postMessage(m);
            //}, 500);
            break;
        case _action_key.USER_LOGIN:
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
        case _action_key.GRAM_ALL_KEY:
            _db_gram.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case _action_key.GRAM_ALL_WORD:
            _db_word_gram.keys().then(function (keys) {
                m.ok = true;
                m.result = keys;
                self.postMessage(m);
            }).catch(function (err) { });
            break;
        case _action_key.GRAM_DETAIL_BY_KEY:
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
    var rs = e.data;
    var m = {}, a = rs.split(_split_data), key = a[0], data = '|', result;
    if (a.length > 1) { data = a[1] };
    m = _cache_request[key];
    if (m != null) {
        data = data.trim();
        try {
            if (data.length > 0 && (data[0] == '{' || data[0] == '[')) { result = JSON.parse(data); } else { result = data; }
        } catch (ex) {
            result = data;
        }
        m.result = result;
        console.log('SOCKET -> UI: ', m);
        self.postMessage(m);

        _db_article.setItem(key, m);
    }

    //var key = a[0].toString().toUpperCase(), s = '';
    //switch (key) {
    //    case 'GRAMMAR_LOAD':
    //        if (a.length > 1) {
    //            s = data.substring(key.length + 1, data.length);
    //            var json = JSON.parse(s);
    //            _db_gram.length().then(function (_numberOfKeys) {
    //                if (_numberOfKeys != json.length) {
    //                    Array.from(json).forEach(function (it) {
    //                        _db_gram.setItem(it.Type, it);
    //                        Array.from(it.KeyWord).forEach(function (word) { _db_word_gram.setItem(word, it.Type); });
    //                    });
    //                }
    //            }).catch(function (err) {
    //                console.log(err);
    //            });
    //        }
    //        break;
    //    case 'HTTP_PORT':
    //        if (a.length > 1)
    //            _port_http = Number(a[1]);
    //        break;
    //    case 'SPEAK_FAIL':
    //        _socket.send(_speak_Text);
    //        break;
    //    default:
    //        self.postMessage(data);
    //        break;
    //}
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