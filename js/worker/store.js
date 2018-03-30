importScripts('promise-worker.register.min.js', 'localforage.min.js', 'underscore.min.js');
Object.prototype.error = function (text_error) { var it = this; if (it == null) { it = {}; } it.ok = false; it.has_error = true; it.error_message = text_error; return it; };

var broadcast;
var cache = {};
var config = {
    /* cache */
    API_CACHE_GET: 'API_CACHE_GET',
    API_CACHE_CLEAN: 'API_CACHE_CLEAN',
    /* broadcast */
    BROADCAST_CONNECT: 'BROADCAST_CONNECT',
    BROADCAST_STATE: false,
    //BROADCAST_ID: btoa(Math.random()),
    BROADCAST_ID: new Date().getTime().toString(),
    /* split define */
    SPLIT_KEY: '¦',
    SPLIT_DATA: '‖',
    /* api define */
    API_OPEN: false,
    API_FILE_LOAD: 'FILE_LOAD',
    API_TREE_NODE: 'TREE_NODE',
    API_USER_LOGIN: 'USER_LOGIN',
    API_GRAM_ALL_KEY: 'GRAM_ALL_KEY',
    API_GRAM_ALL_WORD: 'GRAM_ALL_WORD',
    API_GRAM_DETAIL_BY_KEY: 'GRAM_DETAIL_BY_KEY',
    /* model define */
    m_node: 'type,path,folder,file',
    /* socket define */
    SOCKET_OPEN: false,
    /* App define */
    APP_LOADED: false,
};


/****************************************************************************/
/* SOCKET */

setInterval(function () {
    if (!config.SOCKET_OPEN) {
        console.log('STORE: socket reopen ...', new Date().toString());
        f_socket_init();
    }
}, 5000);

function f_socket_init() {
    ws = new WebSocket('ws://localhost:8889');
    ws.onmessage = on_socket_message_receiver;
    ws.onopen = function () {
        config.SOCKET_OPEN = true;
        if (config.APP_LOADED) {
            f_api_reopen();
        } else {
            config.APP_LOADED = true;
            f_api_open();
        }
    };
    ws.onclose = function () {
        config.SOCKET_OPEN = false;
        f_api_close();
    }
}

function f_socket_send(msg) {
    if (config.SOCKET_OPEN == true) {
        var text = '';
        if (typeof msg === 'string') { text = msg; }
        else { text = JSON.stringify(msg); }
        if (text != '' && text.trim().length > 0) { ws.send(text); }
        console.log('STORE.SOCKET -> SERVER: ', msg);
    }
}

/* Receive message from WebSocket */
var on_socket_message_receiver = function (e) {
    var rs = e.data;
    var m = {}, a = rs.split(config.SPLIT_DATA),
        key = a[0], data = '', result;
    if (a.length > 1) { data = a[1] };

    m = cache[key];
    if (m != null) {
        data = data.trim();
        try {
            if (data.length > 0 && (data[0] == '{' || data[0] == '[')) { result = JSON.parse(data); } else { result = data; }
        } catch (ex) {
            result = data;
        }
        m.result = result;
        console.log('STORE.SOCKET -> UI: ', m);

        f_broadcast_send(m);
        //_db_article.setItem(key, m);
    }
}

/****************************************************************************/
/* API */

function f_broadcast_send(m) {
    if (config.BROADCAST_STATE && broadcast != null) {
        console.log('STORE.BROADCAST -> UI: ', m);
        broadcast.postMessage(m);
    }
}

/* post message for UI when websocket reopen */
function f_api_reopen() {
    f_broadcast_send({ ok: true, callback: 'api.f_reopen' });
}

/* start services for UI when websocket open */
function f_api_open() {
    f_socket_send('GRAMMAR_LOAD');
    f_broadcast_send({ ok: true, callback: 'api.f_open' });
}

/* post message for UI when websocket close */
function f_api_close() {
    f_broadcast_send({ ok: true, callback: 'api.f_close' });
}

/****************************************************************************/
/* STORE START - REGISTER PROMISE WORKER */

function f_cache_key(arr) {
    var s = '';
    if (arr !== null && arr.length > 0) { s = arr.join(config.SPLIT_KEY); }
    return s;
}

registerPromiseWorker(function (m) {
    console.log('UI -> STORE: ', m);
    if (m == null) return m.error('Message must be not null.');

    var value, input = m.input, key;
    switch (m.action) {
        case config.BROADCAST_CONNECT:
            if (m.input != null && 'BroadcastChannel' in self) {
                broadcast = new BroadcastChannel(m.input);
                config.BROADCAST_ID = m.input;
                config.BROADCAST_STATE = true;
                console.log('STORE.BROADCAST.CONNECTED: ', config.BROADCAST_ID);
                broadcast.addEventListener("message", (e) => {
                    var m = e.data;
                    if (m.key_cache != null) {
                        cache[m.key_cache] = m;
                    }
                }, false);
            }
            break;
        case config.API_CACHE_GET:
            if (m.input == null || m.input == '') return m.error('input must be not null or empty');
            value = cache[m.input];
            if (value == null) return m.error('Cannot find item: ' + m.input);
            break;
        case config.API_TREE_NODE:
            if (input.folder != null && input.path != null) {
                key = f_cache_key([m.action, input.path, input.folder]);
                m.key_cache = key;
                cache[key] = m;
                f_socket_send(key);
            }
            {
                //setTimeout(function () {
                //    m.ok = true;
                //    m.result = {
                //        path: 'C:/',
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
                //    f_broadcast_send(m); 
                //}, 3500);
            }
            break;
        default:
            return m.error('Cannot find API: ' + m.action);
            break;
    }
    m.ok = true;
    m.result = value;
    return m;
});

f_socket_init();