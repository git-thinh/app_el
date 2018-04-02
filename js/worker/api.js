importScripts('promise-worker.register.min.js', 'localforage.min.js', 'underscore.min.js');
var api_host = 'http://localhost:3456';
var load = function (url) { var r = new XMLHttpRequest(); r.open('GET', url, false); r.send(null); if (r.status === 200) { return r.responseText; } return ''; }
var ajax_get = function (url, event_ok, event_error) { var r = new XMLHttpRequest(); r.onreadystatechange = function () { if (this.readyState == 4 && this.status == 200) { if (event_ok != null) event_ok(JSON.parse(r.responseText)); } }; r.open("GET", url, true); r.send(); }

/* WORKER - BROADCAST - EVENT SOURCE */
var evtSource = new EventSource(api_host + '/SERVER-SENT-EVENTS');
evtSource.onmessage = (e) => { };
evtSource.onerror = (e) => { };
var broadcast; if ('BroadcastChannel' in self) { broadcast = new BroadcastChannel('BROADCAST_ID'); }
registerPromiseWorker((m) => { self[m.action](m); });
var post_ui = function (m) { broadcast.postMessage(m); }

/* MODULE */
function module_load(m) {
    var input = m.input, id, code, type, selector;
    if (input == null) return;
    selector = input.selector;
    code = input.code;
    id = input.id;
    if (selector == null) selector = '';
    if (code == null) return;
    code = code.toString().trim().toLowerCase();
    type = input.type;
    if (type == null) type = 'init';
    var controller = 'module_' + code + '_controller';

    if (code.match(/[^A-Za-z0-9\_]/) || code.indexOf('___') != -1) {
        console.log('Module code are characters a-z, A-Z, 0-9 and _');
        return;
    }

    switch (type) {
        case 'view':
            if (id == null) return;
            var html = load('/view/' + code + '/index.html'),
                _eval = '';
            if (html != '') {
                html = html.split('___module_id').join(id);
                if (selector == '') html = '<shadow></shadow><content><aside>' + html + '</aside></content>';
                _eval =
                    'setTimeout(function(){ module_init_event({ id:"' + id + '", code: "' + code + '", selector: "' + selector + '"}); ' +
                'if (' + id + ' != null && ' + id + '.controller != null && typeof ' + id + '.controller === "function") { ' + id + '.controller({ state: "load", id:"' + id + '", code: "' + code + '", selector: "' + selector + '" }); } ' +
                    ' else { alert("Cannot find function ___module_id.controller() in file js.js"); } ' +
                    ' }, 0);';
            }
            post_ui({ action: 'module_load', callback: 'module_load', result: { type: type, code: code, id: id, html: html, eval: _eval, className: '', selector: selector } });
            break;
        case 'init':
            id = code + '___' + (new Date().getTime()).toString();

            js = load('/view/' + code + '/js.js'),
                css = load('/view/' + code + '/css.css'),
                _eval = '';
            if (js != '') {
                js = js.split('___module_id').join(id);
                js = ' \r\n ' + js + ' \r\n ';

                _eval =
                    'setTimeout(function(){ ' +
                'if (' + id + ' != null && ' + id + '.init != null && typeof ' + id + '.init === "function") { ' + id + '.init({ code: "' + code + '", id:"' + id + '", selector: "' + selector + '" }); } ' +
                    ' else {  } ' +
                id + '.controller({ state: "init", id:"' + id + '", code: "' + code + '", selector: "' + selector + '" }); }, 0);' +
                'post_api({ action: "module_load", input: { code: "' + code + '", id:"' + id + '", type: "view", selector: "' + selector + '" }});';
            }
            if (css != '') {
                css = '\r\n' + css.split('___module_id').join(id) + '\r\n';
            }
            post_ui({ action: 'module_load', callback: 'module_load', result: { type: type, code: code, id: id, script: js, eval: _eval, style: css, selector: selector } });
            break;
    }
}

/* API: DIR_GET, FILE_LOAD, ... */

function dir_get(m) {
    console.log('API.dir_get: ', m);
    var url = api_host + '?type=dir_get';
    var folder = m.input.folder, path = m.input.path;
    if (folder != null && folder != '') url += '&folder=' + folder;
    if (path != null && path != '') url += '&path=' + path;
    ajax_get(url, (val) => { m.result = val; post_ui(m); });
}

function file_load(m) {
    console.log('API.file_load: ', m);
    var url = api_host + '?type=file_load';
    var file_name = m.input.file_name, path = m.input.path;
    if (file_name != null && file_name != '') url += '&file_name=' + file_name;
    if (path != null && path != '') url += '&path=' + path;
    ajax_get(url, (val) => { m.result = val; post_ui(m); }); 
}