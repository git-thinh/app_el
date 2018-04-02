importScripts('promise-worker.register.min.js', 'localforage.min.js', 'underscore.min.js');
var load = function (url) { var r = new XMLHttpRequest(); r.open('GET', url, false); r.send(null); if (r.status === 200) { return r.responseText; } return ''; }
var isOnline = false, cache = new Array, api = {}, template = {};

/* WORKER - BROADCAST - EVENT SOURCE */
var evtSource = new EventSource('http://localhost:3456/SERVER-SENT-EVENTS');
evtSource.onmessage = api.on_online;
evtSource.onerror = api.on_offline;
var broadcast; if ('BroadcastChannel' in self) { broadcast = new BroadcastChannel('BROADCAST_ID'); }
registerPromiseWorker((m) => { self[m.action](m); });
var post = function (m) { broadcast.postMessage(m); }

/* API */
api.on_online = function () {
    if (isOnline == false) {
        isOnline = true;
        post('online');
    }
};
api.on_offline = function () {
    isOnline = false;
    post('offline');
};

api.on_worker_receiver = function (m) {
    console.log('WORKER: ', m);
    eval(m);
    return null;
};


/***********************************************************************/
/* MODULE */

function module_load(m) {
    var input = m.input, id, code, type;
    if (input == null) return;
    code = input.code;
    id = input.id;
    if (code == null) return;
    type = input.type;
    if (type == null) type = 'init';
    var controller = 'module_' + code + '_controller';

    switch (type) {
        case 'view':
            console.log('WORKER.MODULE.VIEW:', m);
            if (id == null) return;
            var html = load('/view/' + code + '/index.html'),
                _eval = '';
            if (html != '') {
                html = '<shadow></shadow><content><aside>' + html + '</aside></content>';
                _eval =
                    'setTimeout(function(){ module_init({ id:"' + id + '", code: "' + code + '", controller: "' + controller + '" }); ' +
                    controller + '({ state: "load", id:"' + id + '", code: "' + code + '" }); }, 0);';
            }
            post({ action: 'module_load', result: { type: type, code: code, id: id, html: html, eval: _eval, className: '' } });
            break;
        case 'init':
            id = 'm_' + code + '_' + (new Date().getTime()).toString();
                js = load('/view/' + code + '/js.js'),
                css = load('/view/' + code + '/css.css'),
                _eval = '';
            if (js != '') {
                js = 'function ' + controller + '(module){  if (module != null && module.state == "init" && typeof init === "function") { init(module); return; } \r\n ' + js + ' \r\n }; \r\n ';
                _eval =
                    'setTimeout(module_' + code + '_controller({ state: "init", id:"' + id + '", code: "' + code + '" }), 0);' +
                'call_api("module_load", { code: "' + code + '", id:"' + id + '", type: "view" });';
            }
            if (css != '') {
                css = '\r\n' + css.split('module_id').join(id) + '\r\n';
            }
            post({ action: 'module_load', result: { type: type, code: code, id: id, script: js, eval: _eval, style: css } });
            break;
    }
}


//    cache: {
//        f_get: function (m) {
//            if (m < cache.length) { return cache[m]; } else { return null } 
//        },
//        f_set: function (m) {
//            if (m < cache.length) { return cache[m]; } else { return null } 
//            switch (m) {
//                case 'clean': case 'cls':
//                    cache = new Array;
//                    break;
//                case 'print': case 'log': case 'cache':
//                    console.log(cache);
//                    break;
//                default:
//                    cache.push(m);
//                    return cache.length - 1;
//                    break;
//            }
//        }
//    }
//};
