var api = {
    GUID: function (_subfix) {
        var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        if (_subfix != null)
            id = _subfix + id.substring(_subfix.length, id.length);
        return id;
    },
    LIB: {
        FONT_AWESOME_CSS: '/lib/font-awesome-5.0.8/fontawesome-all.min.css',
        LODASH_JS: '/lib/lodash.min.js',
        DIALOG_JS: '/lib/polyfill/dialog.js',
        HEAD_JS: '/lib/head/head.load.custom.min.js',
        JQUERY_JS: '/lib/jquery/jquery-1.11.1.min.js',
        BOOTSTRAP_CSS: '/lib/bootstrap-3.3.7/css/bootstrap.min.css',
        BOOTSTRAP_JS: '/lib/bootstrap-3.3.7/js/bootstrap.min.js',
        W2UI_JS: '/lib/w2ui/w2ui.min.js',
        W2UI_CSS: '/lib/w2ui/w2ui.min.css',
        KitUI_CSS: '/lib/kitui.css',
    },
    split: function (str, tokens) {
        /// splitMulti('a=b,c:d', ['=', ',', ':']) // ["a", "b", "c", "d"]

        var tempChar = tokens[0];
        // We can use the first token as a temporary join character
        for (var i = 1; i < tokens.length; i++) {
            if (tokens[i] == '') continue;
            str = str.split(tokens[i]).join(tempChar);
        }
        str = str.split(tempChar);
        return str;
    },
    indicator: {
        m_ID: 'indicator_id',
        Show: function () {
            var it = document.getElementById(api.indicator.m_ID);
            if (it != null)
                it.style.display = 'block';
        },
        Hide: function (_hideAfterMilisecond) {
            var it = document.getElementById(api.indicator.m_ID);
            if (it != null) {
                if (_hideAfterMilisecond == null)
                    it.style.display = 'none';
                else
                    setTimeout(function () { document.getElementById(api.indicator.m_ID).style.display = 'none'; }, _hideAfterMilisecond);
            }
        },
        SetText: function (_text) {
            var it = document.querySelector('#' + api.indicator.m_ID + ' label');
            if (it != null)
                it.textContent = _text;
        }
    },
    js_css: {
        Load: function (_arrayFiles, _callback) {
            var filename = "link.css", sheet, i;
            var fileref = document.createElement("link");

            readyfunc = function () {
                alert("File Loaded");
            }

            timerfunc = function () {
                for (i = 0; i < document.styleSheets.length; i++) {
                    sheet = document.styleSheets[i].href;
                    if (sheet !== null && sheet.substr(sheet.length - filename.length) == filename)
                        return readyfunc();
                }
                setTimeout(timerfunc, 50);
            }

            if (document.all) { //Uses onreadystatechange for Internet Explorer
                fileref.attachEvent('onreadystatechange', function () {
                    if (fileref.readyState == 'complete' || fileref.readyState == 'loaded')
                        readyfunc();
                });
            } else {    //Checks if the stylesheet has been loaded every 50 ms for others
                setTimeout(timerfunc, 50);
            }
            document.getElementsByTagName("head")[0].appendChild(fileref);
        },
        LoadScript: function (_url, _callback) {
            if (!_url || !(typeof _url === 'string')) { return };
            var script = document.createElement('script');
            if (typeof document.attachEvent === "object") {
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded') {
                        if (_callback) { _callback() }
                    }
                };
            } else {
                script.onload = function () {
                    if (_callback) { _callback() }
                }
            };
            script.src = _url;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        LoadCSS: function (_url, _callback) {
            if (!_url || !(typeof _url === 'string')) { return };
            var link = document.createElement('link');

            if (typeof document.attachEvent === "object") {
                link.onreadystatechange = function () {
                    if (link.readyState === 'loaded') {
                        if (_callback) { _callback() }
                    }
                };
            } else {
                link.onload = function () {
                    if (_callback) { _callback() }
                }
            };

            link.type = "text/css";
            link.rel = "stylesheet"
            link.href = _url;
            document.getElementsByTagName('head')[0].appendChild(link);
        },
        ImportSupportJSON: function () {
            /*! JSON for IE6/IE7 */
            if (!window.JSON) {
                //document.write('<scr' + 'ipt src="http://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"><\/scr' + 'ipt>');
                document.write('<scr' + 'ipt src="/lib/json3.min.js"><\/scr' + 'ipt>');
            }
        }
    },
    utility: {
    },
    validate: {
        check_IP4: function () { },
        check_IP6: function () { },
    },
    dialog: {
        Show: function (_id) {
            var _el = document.getElementById(_id);
            if (_el == null) { return; }
            if (_el.show == null) {
                api.js_css.LoadScript(api.LIB.DIALOG_JS, function () {
                    dialogPolyfill.registerDialog(_el);
                    _el.show();
                });
            } else {
                _el.show();
            }
        },
        Close: function (_id) {
            if (typeof _id == 'string') {
                var _el = document.getElementById(_id);
                _el.close();
            } else {
                var parent = _id.parentNode;
                while (parent.tagName !== "HTML") {
                    if (parent.tagName === 'DIALOG') {
                        break;
                    }
                    parent = parent.parentNode;
                }
                parent.close();
            }
        }
    },
    alert: {
        Show: function (_title, _content, _hideOK, _hideCancel, _timeOut, _callBack) {
            if (_title == null) return;

            var tit = document.querySelector('#dialog_Alert h3');
            var con = document.querySelector('#dialog_Alert p');
            if (tit == null || con == null) return;
            if (_content == null) {
                tit.textContent = '';
                con.textContent = _title;
                tit.classList = ['hide'];
            } else {
                tit.textContent = _title;
                con.textContent = _content;
                tit.classList = [''];
            }

            var ok = document.querySelector('#dialog_Alert button.ok');
            if (ok != null) {
                if (_hideOK == true)
                    ok.classList = ['ok hide'];
                else
                    ok.classList = ['ok'];
            }

            var cancel = document.querySelector('#dialog_Alert button.cancel');
            if (cancel != null) {
                if (_hideCancel == true)
                    cancel.classList = ['cancel hide'];
                else
                    cancel.classList = ['cancel'];
            }

            api.dialog.Show('dialog_Alert');
            if (_timeOut != null && _timeOut > 0)
                setTimeout(api.alert.Close, _timeOut);
        },
        Close: function () { api.dialog.Close('dialog_Alert'); }
    },
    log: {
        m_modalID: 'log_View',
        m_buttonID: 'log_Button',
        Write: function (_title, _item) {
            if (_item == null)
                console.log(_title);
            else
                console.log(_title, _item);
        },
        Toggle: function () {
            $('#' + api.log.m_modalID).modal("toggle");
        },
        Open: function () {
            $('#' + api.log.m_modalID).modal();
        },
        ShowButton: function () {
            $('#' + api.log.m_buttonID).show();
        }
    },
    user: {
        m_ID: null,
        Login: function () {
            //api.dialog.Show('dialog_Login');
        },
        Register: function () {

        },
    },
    loading: {
        Hide: function () {
            var l = document.getElementById('loading');
            if (l != null)
                l.style.display = 'none';
        },
        Show: function () {
            var l = document.getElementById('loading');
            if (l != null)
                l.style.display = 'block';
        }
    },
    notification: {},
    cache: {
        m_ID: 'CACHE_STORE',
        Get: function (_key, _callback, _afterRemove) {
            if (_afterRemove == null) _afterRemove = false;
        },
        Set: function (_key, _value, _callback) { }
    },
    msg: {
        Process: function (_event) {
            var _clientID = _event.data.client;
            var _data = _event.data.message;
            //sessionStorage.id = _clientID;
            api.log.Write(_clientID, _data);
            if (_data != null && _data.length > 0 && _data[0] == '{' && _data[_data.length - 1] == '}') {
                var m = JSON.parse(_data);
                var _type = m.type, _name = m['name'], _rs = m['result'], _after_get_remove = m['after_get_remove'];
                switch (_type) {
                    case 'callback':
                        if (typeof window[_name] === 'function') {
                            api.cache.Get(_rs, function (_val) {
                                window[_name](_val);
                            }, _after_get_remove);
                        }
                        break;
                }
            }
        },
        SendToWorker: function (_msg) {
            // There isn't always a service worker to send a message to. This can happen
            // when the page is force reloaded.
            if (!navigator.serviceWorker.controller) // error: no controller';
                return;
            var _text = '';
            if (typeof _msg == 'string') _text = _msg;
            else _text = JSON.stringify(_msg);

            // Send the message to the service worker.
            navigator.serviceWorker.controller.postMessage(_text);
        },
        SendToClientID: function (_clientID, _data) {
        },
        SendToBroadCast: function (_data) {
        },
    },
    db: {
        m_open: false,
        m_writeFile: false,
        Query: function (_query) {
            if (typeof _query != 'object') return null;
            var id = api.utility.GUID();
            sessionStorage[id] = _callback;
            _query['query_id'] = id;
            api.msg.SendToWorker(_msg);
            return id;
        }
    },
    socket: {
        m_ID: 0,
        m_Opened: false,
        m_timeOut_ReOpen: null,
        Init: function () {
            if (api.socket.m_timeOut_ReOpen != null)
                api.log.Write('Re connecting to service ...');

            var wsImpl = window.WebSocket || window.MozWebSocket;
            window.ws = new wsImpl('ws://localhost:8889');
            ws.onmessage = api.socket.Message;
            ws.onopen = api.socket.Open;
            ws.onclose = api.socket.Close;
            ws.onerror = api.socket.Error;
        },
        ReOpen: function (_timeOut) {
            if (api.socket.m_timeOut_ReOpen == null) {
                api.log.Write('SOCKET -> ReOpen ...');
                api.socket.m_timeOut_ReOpen = setInterval(api.socket.Init, _timeOut);
            }
        },
        Error: function () {
            api.alert.Show('Websocket', 'Error in connection establishment', true, true);
            api.socket.ReOpen(5000);
        },
        Close: function () {
            if (api.socket.m_timeOut_ReOpen == null) {
                api.log.Write('the socket connection is closed');
                api.socket.ReOpen(5000);
            }
        },
        Open: function () {
            api.socket.m_Opened = true;
            if (api.socket.m_timeOut_ReOpen != null) {
                clearInterval(api.socket.m_timeOut_ReOpen);
                api.socket.m_timeOut_ReOpen = null;
                api.alert.Close();
            }
            api.log.Write('the socket connection is established');
            api.user.Login();
        },
        Message: function (_event) {
            var data = _event.data;
            if (data.indexOf('ID=') == 0) {
                api.socket.m_ID = data.substring(3, data.length);
                api.log.Write('SOCKET_ID', api.socket.m_ID);
            } else {
                var it = JSON.parse(data);
                api.log.Write('SOCKET_MESSAGE', it);
                var _callback = it['callback'];
                if (typeof window[_callback] === 'function')
                    window[_callback](it);
            }
        },
        Send: function (_msg) {
            if (api.socket.m_Opened == true) {
                var _text = '';
                if (typeof _msg === 'string') _text = _msg;
                else _text = JSON.stringify(_msg);
                ws.send(_text);
                api.log.Write('SOCKET_SEND', _msg);
            }
            return false;
        }
    },
    layout: {
        Init: function () {
            //var pstyle = 'background-color:#000;border:none;padding:0;';
            //$('#layout').w2layout({
            //    name: 'layout',
            //    panels: [
            //        { type: 'top', size: 50, resizable: true, style: pstyle, content: '' },
            //        { type: 'left', size: 200, resizable: true, style: pstyle, content: '' },
            //        { type: 'main', style: pstyle, content: '' },
            //        { type: 'preview', size: '50%', resizable: true, hidden: false, style: pstyle, content: '' },
            //        { type: 'right', size: 200, resizable: true, hidden: false, style: pstyle, content: '' },
            //        { type: 'bottom', size: 50, resizable: true, hidden: false, style: pstyle, content: '' }
            //    ]
            //});

            head.load([
                '/data/english/ui/layout.js',
                '/data/english/ui/top.js',
                '/data/english/ui/bottom.js',
                '/data/english/ui/left.js',
                '/data/english/ui/preview.js',
                '/data/english/ui/right.js',
                '/data/english/ui/top.js'
            ], function () {


            });

            api.app.m_Loaded = true;
        }
    },
    app: {
        m_Loaded: false,
        Init: function () {
            api.socket.Init();

            //api.dialog.Show('dialog_Login');
            api.js_css.LoadScript(api.LIB.HEAD_JS, function () {
                head.load([
                    '/lib/font-awesome.min.css',
                    api.LIB.W2UI_CSS,
                    api.LIB.BOOTSTRAP_CSS,
                    api.LIB.KitUI_CSS,
                    api.LIB.JQUERY_JS,
                    api.LIB.BOOTSTRAP_JS,
                    api.LIB.W2UI_JS,
                    api.LIB.LODASH_JS,
                ], function () {
                    api.log.Write('Completed load library base: jquery, bootstrap ...');
                    api.layout.Init();
                });
            });
        },
    },
    send: function (_msg) {
        if (_msg.action == null) _msg.action = '';
        if (_msg.callback == null) _msg.callback = '';
        if (_msg.data == null) _msg.data = {};
        if (_msg.id == null) {
            _msg.id = 'msg-xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        api.socket.Send(_msg);

        sessionStorage[_msg.id] = JSON.stringify(_msg);
        return _msg.id;
    },
    callback: function (it, eventName) {
        var s = '', _func = '', _para = null;
        if (it.hasAttribute('do')) {
            s = it.getAttribute('do');
            var a = s.split('|');
            _func = a[0];
            if (a.length > 1) _para = a[1];
            if (typeof window[_func] == 'function') {
                if (_para == null)
                    window[_func](it, eventName);
                else
                    window[_func](it, eventName, _para);
            }
        }
    },
    m_worker: null,
    init: function () {
        /* Clean all cache */
        sessionStorage.clear();

        window.onclick = function (event) {
            api.callback(event.target, 'click');
        }

        window.ondblclick = function (event) {
            api.callback(event.target, 'dblclick');
        }

        m_worker = new Worker('worker.js');
        m_worker.addEventListener('message', function (e) {
            console.log('API: ', e.data);
        }, false);

        setInterval(function () {
            m_worker.postMessage([
                'A service worker is a type of web worker',
                'It\'s essentially a JavaScript file',
                'that runs separately from the main browser thread',
                'intercepting network requests',
                'caching or retrieving resources from the cache',
                'and delivering push messages'
            ], 1);
        }, 5000);
    }
};


function ___tree_Cache() {
    setTimeout(function () {
        var _tree = document.getElementById('tree_data_cache');
        if (_tree != null)
            localStorage['tree_data_cache'] = _tree.innerHTML;
    }, 1000);
}

function ___tree_LoadItems(ele, eventName, para) {
    if (para == null) para = '';
    console.log('ELEMENT: ', ele);
    console.log('EVENT: ', eventName);
    console.log('PARA: ', para);

    var _forID = '';
    if (ele.hasAttribute('for'))
        _forID = ele.getAttribute('for');

    if (_forID == '') {
        _forID = api.GUID();
        ele.setAttribute('for', _forID);
    }

    var _state = sessionStorage[_forID];
    switch (_state) {
        case 'opening':
            return;
        case 'opened':
            if (eventName == 'dblclick') {
                console.log('>>>>>>>>> refresh nodes ...');
            } else if (eventName == 'click') {

            }
            break;
        default:
            _state = 'opening';
            sessionStorage[_forID] = _state;
            break;
    }

    if (_state == 'opening') {
        var _loadingID = api.GUID();

        var p = document.createElement('P');
        p.id = _loadingID;
        p.className = 'loading';
        ele.parentElement.appendChild(p);

        var _text = ele.innerHTML;
        var m = {
            action: 'LOAD_SUB_DIR_FILE',
            callback: '___tree_BindResultQuery',
            config: {
                loading_id: _loadingID,
                for_id: _forID
            },
            data: {
                ext: 'txt',
                folder: _text,
                root: para
            }
        };
        var query_id = api.send(m);
    }
}

function ___tree_BindResultQuery(result) {
    console.log('___tree_BindResultQuery', result);
    var _config = result['config'];
    var _result = result['result'];
    var _ok = result['ok'];
    if (_ok == true && _result != true && _config != null) {
        var $loading = $('#' + _config['loading_id']);
        if ($loading)
            $loading.remove();

        var _forID = _config['for_id'];
        var ele = $('[for="' + _forID + '"]');
        if (ele != null) {
            var files = _result['files'];
            var dirs = _result['dirs'];
            var root = _result['root'];

            var s = '';
            dirs.forEach(function (it) {
                if (it.count > 0)
                    s += '<details><summary do="___tree_LoadItems|' + root + '\\' + it.name + '">' + it.name + '(' + it.count + ')' + '</summary></details>';
                else
                    s += '<details><summary>' + it.name + '(' + it.count + ')' + '</summary></details>';
            });
            files.forEach(function (it) {
                var id = api.GUID();
                it.id = id;
                it.root = root;
                sessionStorage[id] = JSON.stringify(it);
                s += '<p do="___tree_readFile|' + id + '">' + it.title + '</p>';
            });

            ele.parent().append(s);
            sessionStorage[_forID] = 'opened';
        }
        ___tree_Cache();
    }
}

function ___tree_readFile(ele, eventName, para) {
    console.log('ELEMENT: ', ele);
    console.log('EVENT: ', eventName);
    console.log('PARA: ', para);
    if (para == null || para == '') return;

    var file = JSON.parse(sessionStorage[para]);
    console.log('PARA_FILE: ', file);
    var tab_id = file.id;

    var tabs = w2ui.layout_main_tabs;
    if (tabs.get(tab_id)) {
        tabs.select(tab_id);
        w2ui.layout.html('main', 'Content: ' + file.title);
    } else {
        var a = file.title.split(' ');
        var _tit = file.title;
        if (a.length > 4) _tit = a[0] + ' ' + a[1] + ' ' + a[2] + ' ' + a[3] + '...';

        tabs.add({ id: tab_id, caption: _tit, closable: true, tooltip: file.title });
        //w2ui.layout.html('main', 'Content: ' + file.title);
        $('.ui_tab_item').hide();
        $('#ui_main_id').append('<div class="ui_tab_item" for="' + tab_id + '">' + file.title + '</div>')
    }
}

