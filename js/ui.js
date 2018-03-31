!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).PromiseWorker = e() } }(function () { return function e(t, n, r) { function o(u, s) { if (!n[u]) { if (!t[u]) { var c = "function" == typeof require && require; if (!s && c) return c(u, !0); if (i) return i(u, !0); var a = new Error("Cannot find module '" + u + "'"); throw a.code = "MODULE_NOT_FOUND", a } var f = n[u] = { exports: {} }; t[u][0].call(f.exports, function (e) { var n = t[u][1][e]; return o(n || e) }, f, f.exports, e, t, n, r) } return n[u].exports } for (var i = "function" == typeof require && require, u = 0; u < r.length; u++)o(r[u]); return o }({ 1: [function (e, t, n) { (function (e) { "use strict"; var n, r, o = e.MutationObserver || e.WebKitMutationObserver; if (o) { var i = 0, u = new o(f), s = e.document.createTextNode(""); u.observe(s, { characterData: !0 }), n = function () { s.data = i = ++i % 2 } } else if (e.setImmediate || void 0 === e.MessageChannel) n = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () { var t = e.document.createElement("script"); t.onreadystatechange = function () { f(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null }, e.document.documentElement.appendChild(t) } : function () { setTimeout(f, 0) }; else { var c = new e.MessageChannel; c.port1.onmessage = f, n = function () { c.port2.postMessage(0) } } var a = []; function f() { var e, t; r = !0; for (var n = a.length; n;) { for (t = a, a = [], e = -1; ++e < n;)t[e](); n = a.length } r = !1 } t.exports = function (e) { 1 !== a.push(e) || r || n() } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 2: [function (e, t, n) { "use strict"; var r = e(1); function o() { } var i = {}, u = ["REJECTED"], s = ["FULFILLED"], c = ["PENDING"]; function a(e) { if ("function" != typeof e) throw new TypeError("resolver must be a function"); this.state = c, this.queue = [], this.outcome = void 0, e !== o && p(this, e) } function f(e, t, n) { this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof n && (this.onRejected = n, this.callRejected = this.otherCallRejected) } function l(e, t, n) { r(function () { var r; try { r = t(n) } catch (t) { return i.reject(e, t) } r === e ? i.reject(e, new TypeError("Cannot resolve promise with itself")) : i.resolve(e, r) }) } function h(e) { var t = e && e.then; if (e && "object" == typeof e && "function" == typeof t) return function () { t.apply(e, arguments) } } function p(e, t) { var n = !1; function r(t) { n || (n = !0, i.reject(e, t)) } function o(t) { n || (n = !0, i.resolve(e, t)) } var u = d(function () { t(o, r) }); "error" === u.status && r(u.value) } function d(e, t) { var n = {}; try { n.value = e(t), n.status = "success" } catch (e) { n.status = "error", n.value = e } return n } t.exports = a, a.prototype.catch = function (e) { return this.then(null, e) }, a.prototype.then = function (e, t) { if ("function" != typeof e && this.state === s || "function" != typeof t && this.state === u) return this; var n = new this.constructor(o); this.state !== c ? l(n, this.state === s ? e : t, this.outcome) : this.queue.push(new f(n, e, t)); return n }, f.prototype.callFulfilled = function (e) { i.resolve(this.promise, e) }, f.prototype.otherCallFulfilled = function (e) { l(this.promise, this.onFulfilled, e) }, f.prototype.callRejected = function (e) { i.reject(this.promise, e) }, f.prototype.otherCallRejected = function (e) { l(this.promise, this.onRejected, e) }, i.resolve = function (e, t) { var n = d(h, t); if ("error" === n.status) return i.reject(e, n.value); var r = n.value; if (r) p(e, r); else { e.state = s, e.outcome = t; for (var o = -1, u = e.queue.length; ++o < u;)e.queue[o].callFulfilled(t) } return e }, i.reject = function (e, t) { e.state = u, e.outcome = t; for (var n = -1, r = e.queue.length; ++n < r;)e.queue[n].callRejected(t); return e }, a.resolve = function (e) { if (e instanceof this) return e; return i.resolve(new this(o), e) }, a.reject = function (e) { var t = new this(o); return i.reject(t, e) }, a.all = function (e) { var t = this; if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array")); var n = e.length, r = !1; if (!n) return this.resolve([]); var u = new Array(n), s = 0, c = -1, a = new this(o); for (; ++c < n;)f(e[c], c); return a; function f(e, o) { t.resolve(e).then(function (e) { u[o] = e, ++s !== n || r || (r = !0, i.resolve(a, u)) }, function (e) { r || (r = !0, i.reject(a, e)) }) } }, a.race = function (e) { var t = this; if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array")); var n = e.length, r = !1; if (!n) return this.resolve([]); var u = -1, s = new this(o); for (; ++u < n;)c = e[u], t.resolve(c).then(function (e) { r || (r = !0, i.resolve(s, e)) }, function (e) { r || (r = !0, i.reject(s, e)) }); var c; return s } }, { 1: 1 }], 3: [function (e, t, n) { "use strict"; var r = "undefined" != typeof Promise ? Promise : e(2), o = 0; function i(e, t) { var n = function (e) { try { return JSON.parse(e) } catch (e) { return !1 } }(t.data); if (n) { var r = n[0], o = n[1], i = n[2], u = e._callbacks[r]; u && (delete e._callbacks[r], u(o, i)) } } function u(e) { var t = this; t._worker = e, t._callbacks = {}, e.addEventListener("message", function (e) { i(t, e) }) } u.prototype.postMessage = function (e) { var t = this, n = o++, u = [n, e]; return new r(function (e, r) { t._callbacks[n] = function (t, n) { if (t) return r(new Error(t.message)); e(n) }; var o = JSON.stringify(u); if (void 0 !== t._worker.controller) { var s = new MessageChannel; s.port1.onmessage = function (e) { i(t, e) }, t._worker.controller.postMessage(o, [s.port2]) } else t._worker.postMessage(o) }) }, t.exports = u }, { 2: 2 }] }, {}, [3])(3) });
Date.prototype.customFormat = function (formatString) { var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th; var dateObject = this; YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2); MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M; MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3); DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D; DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3); th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th'; formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th); h = (hhh = dateObject.getHours()); if (h == 0) h = 24; if (h > 12) h -= 12; hh = h < 10 ? ('0' + h) : h; hhhh = hhh < 10 ? ('0' + hhh) : hhh; AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase(); mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m; ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s; return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM); };
Object.prototype.getOrCreateID = function () { var id = 'ID' + (new Date().getTime() + Math.floor(Math.random() * 100)).toString() /*random [0,99]*/; if (this.hasAttribute('id')) { id = this.getAttribute('id'); } else { this.setAttribute('id', id); } return id; }
//window.console.log = function (title, data) { };

var broadcast;
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
    node: 'type,path,folder,file',
};

var api = new PromiseWorker(new Worker('js/worker/store.js'));
var ui = {
    post: function (m, callback, error) {
        var it = api.postMessage(m)
            .then(function (val) {
                if (val != null && val.ok == true &&
                    callback != null && typeof callback === 'function') { callback(val); }
                else if (val != null && val.has_error == true &&
                    error != null && typeof error === 'function') { error(val); }
            });
    },
    m_elem_current_id: null,
    m_form_current: null,
    on_broadcast_message_receiver: function (e) {
        console.log('UI.BROADCAST -> RECEIVER: ', e.data);
        var m = e.data;
        if (typeof m === 'string') {
        } else { ui.f_callback(m.callback, m); }
    },
    on_dom_click: function (e) {
        var el = e.target;
        console.log('UI.CLICK: ', el.tagName);
        if (el.hasAttribute('type') && el.getAttribute('type') == 'submit') {
            ui.m_elem_current_id = el.getOrCreateID();
            ui.m_form_current = el.closest('form');
        } else {
            ui.m_form_current = null;
            var el = document.getElementById('null');
            if (el == null) el = e.target;
            if ((el.innerText == 'Cancel' || el.innerText == 'Ok') && el.tagName == 'BUTTON') { ui.dialog.f_cancel(el); } else {
                if (el.hasAttribute('do')) {
                    var id = el.getOrCreateID();
                    ui.m_elem_current_id = id;
                    var rs = {};
                    var m = { callback: el.getAttribute('do'), selector: id };
                    ui.f_callback(m.callback, m);
                }
            }
        }
    },
    f_form_submit: function (callback) {
        var form = ui.m_form_current;
        if (form != null && form.elements != null) {
            var data = {};
            var formElements = form.elements, name;
            for (var i = 0; i < formElements.length; i++) {
                if (formElements[i].type != "submit") {
                    name = formElements[i].name;
                    if (name != null && name.toString().trim().length != 0) {
                        data[formElements[i].name] = formElements[i].value;
                    }
                }
            }
            var m = { selector: ui.m_elem_current_id, input: data };
            console.log('FORM: ', m);
            ui.f_callback(callback, m);
        } else { console.log('Cannot find form to submit.'); }
    },
    f_callback: function (para, m) {
        if (para == null || para.toString().trim().length == 0) return;
        console.log('UI.CALLBACK: ', para);
        var s = '';
        if (typeof para === 'string') { s = para; } else {
            alert('f_callback() ????');
        }
        if (s != '') {
            var a = s.split(config.SPLIT_KEY),
                fs = a[0].split(','),
                func = fs[0].trim(),
                model = (fs.length > 1 ? fs[1] : null);

            if (func.length > 0) {
                var fs = func.split('.'), fn = fs[0], fi = ui[fn], exist = true;
                if (fi == null) { exist = false; } else {
                    for (var i = 1; i < fs.length; i++) {
                        fn = fs[i];
                        if (fi[fn] != null && typeof fi[fn] === 'function') {
                            fi = fi[fn];
                        } else {
                            exist = false;
                            break;
                        }
                    }
                }
                if (exist) {
                    if (m == null) { m = {}; }
                    if (m.input == null) { m.input = {}; }

                    /* exist paramenters */
                    if (a.length > 1) {
                        switch (model) {
                            case 'key':
                                break;
                            case 'session':
                                break;
                            case 'local':
                                break;
                            case 'cookie':
                                break;
                            default:
                                var fields = config[model];
                                if (fields == null) {
                                    m.input = a.filter(function (it, k) { return k != 0; });
                                } else {
                                    var o = {};
                                    fields.split(',').forEach(function (name, index) { var val = null, id = index + 1; if (id < a.length) { val = a[id]; } o[name] = val; });
                                    m.input = o;
                                }
                                break;
                        }

                    }

                    fi(m);
                } else {
                    console.log('ERROR: cannot find function: ' + func + ' in check exist');
                }
            }
        }
    },
    cache: {
        f_set: function (key, m) {
            if (config.BROADCAST_STATE && broadcast != null && key !== null) {
                if (typeof key != 'string') { key = key.toString(); }
                m.cache_key = key;
                console.log('UI.BROADCAST -> STORE set cache: ' + key, m);
                broadcast.postMessage(m);
            }
        },
        f_get: function (key, callback, error) {
            ui.post({ action: config.API_CACHE_GET, input: key }, callback, error);
        },
    },
    cookie: {
        f_set: function (cname, cvalue) {
            var d = new Date(), exdays = 10;
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        f_get: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        }
    },
    dialog: {
        f_hide_all: function () {
            Array.from(document.querySelectorAll('section')).forEach(function (el) { el.style.display = 'none'; });
        },
        f_cancel: function (el) {
            var mod = el.closest('section');
            if (mod != null) {
                mod.style.display = 'none';
            }
        },
        f_input_show: function () {
            var el = document.getElementById('ui-input');
            if (el != null) {
                el.style = '';
            }
        },
        f_indicator_show: function (msg, callback) {
            var el = document.getElementById('ui-indicator');
            if (el != null) {
                el.style = '';
            }
        },
        f_indicator_hide: function () {
            var el = document.getElementById('ui-indicator');
            if (el != null) { el.style.display = 'none'; }
        },
        f_alert_show: function (msg, title, hideOK, callback) {
            if (msg == null) return;
            var content = msg, is_error = false;
            if (typeof msg != 'string') {
                if (msg.has_error) is_error = true;
                if (msg.error_message) content = msg.error_message;
            }
            if (title != null && title.toLowerCase() == 'error') is_error = true;

            var el = document.getElementById('ui-alert');
            if (el != null) {
                el.style = '';
                el.querySelector('p').innerHTML = content;
                if (title != null) el.querySelector('h3').innerHTML = title;
                if (is_error) {
                    el.style.backgroundColor = 'red';
                } else {
                    el.style.backgroundColor = '#fff';
                }
                if (hideOK) { el.querySelector('button').style.display = 'none'; } else { el.querySelector('button').style = 'block'; }
            }
        },
        f_alert_hide: function () {
            var el = document.getElementById('ui-alert');
            if (el != null) { el.style.display = 'none'; }
        },
        f_confirm_show: function (msg, title, callback_ok, callback_cancel) {
            var el = document.getElementById('ui-confirm');
            if (el != null) {
                el.style = '';
            }
        }
    },
    article: {
        m_ele_article: document.getElementById('ui-article'),
        f_load: function (m) {
            var el = ui.article.m_ele_article;
            if (el != null) {
                el.innerHTML = m.result;
                el.scrollTop = 0;
            }
        }
    },
    tree: {
        m_ele_tree: document.getElementById('ui-category'),
        on_toggle_click: function (m) {
            var el = ui.tree.m_ele_tree;
            if (el != null) {
                if (el.style.display == 'none') { el.style = ''; ui.cookie.f_set('TREE', 'block'); } else { el.style.display = 'none'; ui.cookie.f_set('TREE', 'none'); }
            }
        },
        on_node_click: function (m) {
            var el = document.getElementById(m.selector);
            if (el != null) {
                console.log('UI.tree.on_node_click: ',m);
                var node = m.input, pa = el.parentElement;
                if (node == null) return;

                switch (node.type) {
                    case 'root': case 'dir':
                        m.action = 'TREE_NODE';
                        m.callback = 'tree.rs_node_click';
                        ui.post(m, ui.dialog.f_indicator_show, ui.dialog.f_alert_show);
                        break; 
                    case 'file': 
                        m.action = 'FILE_LOAD';
                        m.callback = 'tree.rs_node_click'; 
                        ui.post(m, ui.dialog.f_indicator_show, ui.dialog.f_alert_show);
                        break;
                }

                return;

                /* Load subfolder and files */
                if (pa.tagName == 'DETAILS') {

                }
                /* Load content file */
                else if (el.tagName == 'LI') {
                    //el.insertAdjacentElement('afterend', img);
                    ui.dialog.f_indicator_show('Please wait for loading article ...!');
                    m.action = 'FILE_LOAD';
                    m.callback = 'tree.rs_node_click';
                    var input;
                    if (m.para != null || m.para.length > 1) {
                        input = { path: '', name: m.para[0], type: m.para[1] };
                    }
                    m.input = input;
                    ui.f_post(m);
                }
            }
        },
        rs_node_click: function (m) {
            console.log(m);
            /* Load content file */
            if (m.action == 'FILE_LOAD') {
                switch (m.result_type) {
                    case 'html':
                        ui.article.f_load(m);
                        ui.dialog.f_indicator_hide();
                        var el = document.getElementById(m.selector);
                        if (el != null) {
                            Array.from(document.querySelectorAll('li.file')).forEach(function (it) { it.className = 'file'; });
                            el.className = 'file active'
                        }
                        break;
                    case 'text':
                        var file = m.input.name;
                        sessionStorage[file] = m.result;
                        break;
                    case 'word':
                        var arrayWords = m.result;
                        if (arrayWords != null && arrayWords.length > 0) {
                            var el = ui.tab.m_ele_tab_word;
                            if (el != null) {
                                var s = '<table class="table-master-detail">'
                                Array.from(arrayWords).forEach(function (it, index) {
                                    s += '<tr id=' + it.w + '_w><td></td><td>' + it.w + '</td>' +
                                        '<td id=' + it.w + '_m></td>' +
                                        '<td>' + it.k + '</td>' +
                                        '<td><i class="ico i-plus" do="tab.on_word_detail_click|' + it.w + '"></i></td>' +
                                        '</tr><tr class=detail><td colspan=5 id=' + it.w + '_wd></td></tr>';
                                });
                                s += '</table';
                                el.innerHTML = s;
                            }
                        }
                        break;
                }
            } else {
                /* load sub folder and files */
                var el = document.getElementById(m.selector);
                if (el != null) {
                    var rs = m.result;
                    if (rs == null) return;
                    var path = rs.path;

                    var s = '<ul>';
                    Array.from(rs.dirs).forEach(function (it) {
                        if (it.count > 0) {
                            s += '<li><details><summary do="tree.on_node_click,node' +
                                config.SPLIT_KEY + 'dir' +/*path*/
                                config.SPLIT_KEY + path + /*path*/
                                config.SPLIT_KEY +  it.name +/*folder*/
                                config.SPLIT_KEY + /*file*/ '">' + it.name + '(' + it.count + ')</summary></li>';
                        } else {
                            s += '<li class="dir-empty">' + it.name + '</li>';
                        }
                    });
                    Array.from(rs.files).forEach(function (it) {
                        s += '<li class="file" do="tree.on_node_click,node' +
                                config.SPLIT_KEY + 'file' + /*path*/
                                config.SPLIT_KEY + path + /*path*/
                                config.SPLIT_KEY + /*folder*/
                                config.SPLIT_KEY + it.name + /*file*/'">' + it.title + '</li>';
                    });
                    s += '</ul>';

                    var div = document.createElement('div');
                    div.innerHTML = s;
                    el.parentElement.appendChild(div);
                    ui.dialog.f_indicator_hide();
                }
                var img = document.getElementById(m.selector + '.loading');
                if (img != null) { img.remove(); }
            }
        }
    },
    tab: {
        m_ele_tab: document.getElementById('ui-tabs'),
        m_ele_tab_word: document.getElementById('tab_word'),
        on_toggle_click: function (m) {
            var el = ui.tab.m_ele_tab;
            if (el != null) {
                if (el.style.display == 'none') { el.style = ''; ui.cookie.f_set('TAB', 'block'); } else { el.style.display = 'none'; ui.cookie.f_set('TAB', 'none'); }
            }
        },
        on_word_detail_click: function (m) {
            console.log(m);
            if (m.para != null && m.para.length > 0) {
                var word = m.para[0];
                var sel = document.getElementById(m.selector);
                var el = document.getElementById(word + '_wd');
                if (sel != null && el != null) {
                    if (el.parentElement.style.display != 'table-row') {
                        el.parentElement.style.display = 'table-row';
                        sel.className = 'ico i-minus';
                        //el.innerHTML = '<img class=loading src="/indicator.gif"/>';
                        var ul = '<ul>', _word_iff = ' ' + word + ' ', _word_replace = ' <b>' + word + '</b> ';
                        Array.from(document.querySelectorAll('article em')).forEach(function (it) {
                            var tex = it.innerText;
                            if (tex != null) {
                                tex = ' ' + tex.trim().toLowerCase() + ' ';
                                if (tex.indexOf(_word_iff) != -1) {
                                    ul += '<li>' + tex.split(_word_iff).join(_word_replace) + '</li>';
                                }
                            }
                        });
                        ul += '</ul>';
                        el.innerHTML = ul;
                    } else {
                        el.parentElement.style = '';
                        sel.className = 'ico i-plus';
                    }
                }
            }
        },
    },
    api: {
        f_open: function () {
            ui.page.f_view_api_open();
        },
        f_reopen: function () {
            ui.page.f_view_api_reopen();
        },
        f_close: function () {
            ui.page.f_view_api_cannot_connect();
        },
    },
    user: {
        m_account: null,
        m_ele_login: document.getElementById('ui-login'),
        f_login_show: function (msg) {
            var el = ui.user.m_ele_login;
            if (el != null) {
                el.style = '';
                if (msg != null) { el.querySelector('h5').innerHTML = msg; } else { el.querySelector('h5').innerHTML = ''; }
            }
        },
        f_login_hide: function () {
            var el = ui.user.m_ele_login;
            if (el != null) { el.style.display = 'none'; }
        },
        on_login_click: function (m) {
            m.action = 'USER_LOGIN';
            m.callback = 'user.rs_login_click';
            console.log(m);
            ui.user.f_login_hide();
            ui.dialog.f_indicator_show('System authentication account ...');
            ui.f_post(m);
        },
        rs_login_click: function (m) {
            console.log(m);
            ui.dialog.f_indicator_hide();
            if (m.ok == true) {
                ui.user.m_account = m.result;
                ui.page.f_view_login_success();
            } else {
                ui.user.f_login_show(m.result);
            }
        }
    },
    page: {
        f_start: function () {
            if (ui.cookie.f_get('TREE') == '') { ui.cookie.f_set('TREE', 'block'); }
            if (ui.tree.m_ele_tree != null) { ui.tree.m_ele_tree.style.display = ui.cookie.f_get('TREE'); }
            if (ui.cookie.f_get('TAB') == '') { ui.cookie.f_set('TAB', 'block'); }
            if (ui.tab.m_ele_tab != null) { ui.tab.m_ele_tab.style.display = ui.cookie.f_get('TAB'); }

            ui.dialog.f_indicator_hide();
            //ui.user.f_login_show();


            ui.page.f_set_test_env();
            ui.page.f_show();
        },
        f_set_test_env: function () {
            document.querySelector('input[type="password"]').setAttribute('value', 'admin');
            document.getElementById('tree_data').firstElementChild.click();
        },
        m_ele_page: document.getElementById('ui-page'),
        f_hide: function () {
            var el = ui.page.m_ele_page;
            el.style.display = 'none';
        },
        f_show: function () {
            var el = ui.page.m_ele_page;
            el.style.display = 'flex';
        },
        f_view_api_open: function () {
            ui.page.f_start();
        },
        f_view_api_reopen: function () {
            ui.dialog.f_alert_hide();
            ui.dialog.f_indicator_hide();
            ui.user.f_login_show();
        },
        f_view_api_cannot_connect: function () {
            //ui.page.f_hide();
            //ui.dialog.f_hide_all();
            ui.dialog.f_alert_show('Cannot connect to service.', 'Error', true);
        },
        f_view_login_success: function () {
            ui.dialog.f_alert_show('Login successfully');
            ui.page.f_show();
        },
    }
};

/* Broadcast connect */
api.postMessage({ action: config.BROADCAST_CONNECT, input: config.BROADCAST_ID }).then(function (m) { console.log('UI.BROADCAST.CONNECTED: ', config.BROADCAST_ID); });
if ('BroadcastChannel' in window) { broadcast = new BroadcastChannel(config.BROADCAST_ID); broadcast.addEventListener("message", ui.on_broadcast_message_receiver, false); }

/* DOM event listener */
window.onclick = ui.on_dom_click;