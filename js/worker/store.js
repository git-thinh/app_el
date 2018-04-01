importScripts('promise-worker.register.min.js', 'localforage.min.js', 'underscore.min.js');
var vars = new Array;
var broadcast;
var broadcast_msg = new Array;
var cache = {};
var config = {
    /* cache */
    API_CACHE_RENDER: 'API_CACHE_RENDER',
    API_CACHE_GET: 'API_CACHE_GET',
    API_CACHE_GET_INPUT: 'API_CACHE_GET_INPUT',
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

setInterval(function () {
    if (broadcast_msg.length > 0) {
        var m = broadcast_msg.pop();
        if (config.BROADCAST_STATE && broadcast != null && m != null) {
            broadcast.postMessage(m);
        }
    }
}, 100);

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

        broadcast_msg.push(m);
        console.log('MSG.PUSH.len = ', broadcast_msg.length);
        //f_broadcast_send(m);
        //_db_article.setItem(key, m);
    }
}

/****************************************************************************/
/* API */

function f_broadcast_send(m) {
    if (config.BROADCAST_STATE && broadcast != null && m != null) {
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
    if (m != null && m.lik) { delete m.lik; vars.push(m); return vars.length - 1; }


    var value, input = m.input, key;

    m.ok = false;
    m.has_error = 0;
    //m.error_message = '';

    //if (m == null) return m.error('Message must be not null.');

    switch (m.action) {
        case config.BROADCAST_CONNECT:
            if (m.input != null && 'BroadcastChannel' in self) {
                broadcast = new BroadcastChannel(m.input);
                config.BROADCAST_ID = m.input;
                config.BROADCAST_STATE = true;
                console.log('STORE.BROADCAST.CONNECTED: ', config.BROADCAST_ID);
                broadcast.addEventListener("message", (e) => {
                    var m = e.data;
                    if (m.cache_key != null) {
                        cache[m.cache_key] = m;
                    }
                }, false);
            }
            break;
        case config.API_CACHE_GET_INPUT:
            var id = Number(m.input);
            if (id != NaN && id < vars.length) value = vars[id];
            break;
        case config.API_CACHE_RENDER:
            value = '';
            Array.from(m.input).forEach(function (it, index) {
                vars.push(it);
                var id = vars.length - 1;
                var tem = m.template;
                tem = tem.replace(/{{_id}}/g, function (match, field) { return id; });
                tem = tem.replace(/{{(\w+)}}/g, function (match, field) { return it[field]; });
                value += tem;
            });
            break;
        case config.API_CACHE_GET:
            //if (m.input == null || m.input == '') return m.error('input must be not null or empty');
            value = cache[m.input];
            //if (value == null) return m.error('Cannot find item: ' + m.input);
            break;
        case config.API_TREE_NODE:
            if (input.folder != null && input.path != null) {
                key = f_cache_key([m.action, input.path, input.folder]);
                m.cache_key = key;
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
        case config.API_FILE_LOAD:
            if (input != null) {
                result_type = 'html';
                key = f_cache_key([m.action, result_type, input.path, input.file]);
                m.result_type = result_type;
                m.cache_key = key;
                cache[key] = m;

                result_type = 'word';
                var key2 = f_cache_key([m.action, result_type, input.path, input.file]);
                var m2 = _.clone(m);
                m2.result_type = result_type;
                m2.cache_key = key2;
                cache[key2] = m2;

                result_type = 'text';
                var key3 = f_cache_key([m.action, result_type, input.path, input.file]);
                var m3 = _.clone(m);
                m3.result_type = result_type;
                m3.cache_key = key3;
                cache[key3] = m3;

                f_socket_send(key);

                //_db_article.getItem(key, function (err, value) {
                //    if (value == null) {
                //        f_socket_Send(key);
                //    } else {
                //        m.result = value.result;
                //        console.log('CACHE.HTML: ', m);
                //        self.postMessage(m);
                //        _db_article.getItem(key2, function (err2, value2) {
                //            if (value2 != null) {
                //                m2.result = value2.result;
                //                console.log('CACHE.WORD: ', m2);
                //                self.postMessage(m2);
                //            }
                //        });
                //        _db_article.getItem(key3, function (err3, value3) {
                //            if (value3 != null) {
                //                m3.result = value3.result;
                //                console.log('CACHE.TEXT: ', m3);
                //                self.postMessage(m3);
                //            }
                //        });
                //    }
                //});
            }
            break;
        default:
            //return m.error('Cannot find API: ' + m.action);
            break;
    }
    m.ok = true;
    m.result = value;
    return m;
});

f_socket_init();