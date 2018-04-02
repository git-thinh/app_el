!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).PromiseWorker = e() } }(function () { return function e(t, n, r) { function o(u, s) { if (!n[u]) { if (!t[u]) { var c = "function" == typeof require && require; if (!s && c) return c(u, !0); if (i) return i(u, !0); var a = new Error("Cannot find module '" + u + "'"); throw a.code = "MODULE_NOT_FOUND", a } var f = n[u] = { exports: {} }; t[u][0].call(f.exports, function (e) { var n = t[u][1][e]; return o(n || e) }, f, f.exports, e, t, n, r) } return n[u].exports } for (var i = "function" == typeof require && require, u = 0; u < r.length; u++) o(r[u]); return o }({ 1: [function (e, t, n) { (function (e) { "use strict"; var n, r, o = e.MutationObserver || e.WebKitMutationObserver; if (o) { var i = 0, u = new o(f), s = e.document.createTextNode(""); u.observe(s, { characterData: !0 }), n = function () { s.data = i = ++i % 2 } } else if (e.setImmediate || void 0 === e.MessageChannel) n = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () { var t = e.document.createElement("script"); t.onreadystatechange = function () { f(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null }, e.document.documentElement.appendChild(t) } : function () { setTimeout(f, 0) }; else { var c = new e.MessageChannel; c.port1.onmessage = f, n = function () { c.port2.postMessage(0) } } var a = []; function f() { var e, t; r = !0; for (var n = a.length; n;) { for (t = a, a = [], e = -1; ++e < n;) t[e](); n = a.length } r = !1 } t.exports = function (e) { 1 !== a.push(e) || r || n() } }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 2: [function (e, t, n) { "use strict"; var r = e(1); function o() { } var i = {}, u = ["REJECTED"], s = ["FULFILLED"], c = ["PENDING"]; function a(e) { if ("function" != typeof e) throw new TypeError("resolver must be a function"); this.state = c, this.queue = [], this.outcome = void 0, e !== o && p(this, e) } function f(e, t, n) { this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof n && (this.onRejected = n, this.callRejected = this.otherCallRejected) } function l(e, t, n) { r(function () { var r; try { r = t(n) } catch (t) { return i.reject(e, t) } r === e ? i.reject(e, new TypeError("Cannot resolve promise with itself")) : i.resolve(e, r) }) } function h(e) { var t = e && e.then; if (e && "object" == typeof e && "function" == typeof t) return function () { t.apply(e, arguments) } } function p(e, t) { var n = !1; function r(t) { n || (n = !0, i.reject(e, t)) } function o(t) { n || (n = !0, i.resolve(e, t)) } var u = d(function () { t(o, r) }); "error" === u.status && r(u.value) } function d(e, t) { var n = {}; try { n.value = e(t), n.status = "success" } catch (e) { n.status = "error", n.value = e } return n } t.exports = a, a.prototype.catch = function (e) { return this.then(null, e) }, a.prototype.then = function (e, t) { if ("function" != typeof e && this.state === s || "function" != typeof t && this.state === u) return this; var n = new this.constructor(o); this.state !== c ? l(n, this.state === s ? e : t, this.outcome) : this.queue.push(new f(n, e, t)); return n }, f.prototype.callFulfilled = function (e) { i.resolve(this.promise, e) }, f.prototype.otherCallFulfilled = function (e) { l(this.promise, this.onFulfilled, e) }, f.prototype.callRejected = function (e) { i.reject(this.promise, e) }, f.prototype.otherCallRejected = function (e) { l(this.promise, this.onRejected, e) }, i.resolve = function (e, t) { var n = d(h, t); if ("error" === n.status) return i.reject(e, n.value); var r = n.value; if (r) p(e, r); else { e.state = s, e.outcome = t; for (var o = -1, u = e.queue.length; ++o < u;) e.queue[o].callFulfilled(t) } return e }, i.reject = function (e, t) { e.state = u, e.outcome = t; for (var n = -1, r = e.queue.length; ++n < r;) e.queue[n].callRejected(t); return e }, a.resolve = function (e) { if (e instanceof this) return e; return i.resolve(new this(o), e) }, a.reject = function (e) { var t = new this(o); return i.reject(t, e) }, a.all = function (e) { var t = this; if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array")); var n = e.length, r = !1; if (!n) return this.resolve([]); var u = new Array(n), s = 0, c = -1, a = new this(o); for (; ++c < n;) f(e[c], c); return a; function f(e, o) { t.resolve(e).then(function (e) { u[o] = e, ++s !== n || r || (r = !0, i.resolve(a, u)) }, function (e) { r || (r = !0, i.reject(a, e)) }) } }, a.race = function (e) { var t = this; if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array")); var n = e.length, r = !1; if (!n) return this.resolve([]); var u = -1, s = new this(o); for (; ++u < n;) c = e[u], t.resolve(c).then(function (e) { r || (r = !0, i.resolve(s, e)) }, function (e) { r || (r = !0, i.reject(s, e)) }); var c; return s } }, { 1: 1 }], 3: [function (e, t, n) { "use strict"; var r = "undefined" != typeof Promise ? Promise : e(2), o = 0; function i(e, t) { var n = function (e) { try { return JSON.parse(e) } catch (e) { return !1 } }(t.data); if (n) { var r = n[0], o = n[1], i = n[2], u = e._callbacks[r]; u && (delete e._callbacks[r], u(o, i)) } } function u(e) { var t = this; t._worker = e, t._callbacks = {}, e.addEventListener("message", function (e) { i(t, e) }) } u.prototype.postMessage = function (e) { var t = this, n = o++, u = [n, e]; return new r(function (e, r) { t._callbacks[n] = function (t, n) { if (t) return r(new Error(t.message)); e(n) }; var o = JSON.stringify(u); if (void 0 !== t._worker.controller) { var s = new MessageChannel; s.port1.onmessage = function (e) { i(t, e) }, t._worker.controller.postMessage(o, [s.port2]) } else t._worker.postMessage(o) }) }, t.exports = u }, { 2: 2 }] }, {}, [3])(3) });
Date.prototype.customFormat = function (formatString) { var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th; var dateObject = this; YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2); MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M; MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3); DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D; DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateObject.getDay()]).substring(0, 3); th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th'; formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th); h = (hhh = dateObject.getHours()); if (h == 0) h = 24; if (h > 12) h -= 12; hh = h < 10 ? ('0' + h) : h; hhhh = hhh < 10 ? ('0' + hhh) : hhh; AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase(); mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m; ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s; return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM); };
//window.console.log = function (title, data) { };

/* WORKER - BROADCAST */
var worker = new PromiseWorker(new Worker('js/worker/api.js'));
var broadcast; if ('BroadcastChannel' in window) { broadcast = new BroadcastChannel('BROADCAST_ID'); broadcast.addEventListener("message", (e) => { var m = e.data; window[m.action](m); }, false); }
var call_api = function (func, input) { var m = { action: func, input: input }; worker.postMessage(m); }

function module_load(m) {
    var result = m.result;
    if (result == null) return;
    var type = result.type;

    switch (type) {
        case 'init':
            var jsID = result.id + '_js',
                script = result.script,
                cssID = result.id + '_css',
                style = result.style,
                _eval = result.eval;
            if (document.getElementById(jsID) == null) {
                var js = document.createElement('script');
                js.id = jsID;
                js.type = 'text/javascript';
                js.innerHTML = script;
                document.body.appendChild(js);
                if (_eval != null) eval(_eval);
            }
            if (document.getElementById(cssID) == null) {
                var css = document.createElement('style');
                css.id = cssID;
                css.type = 'text/css';
                css.innerHTML = style;
                document.body.appendChild(css);
            }
            break;
        case 'view':
            var selector = result.selector, code = result.code, htmID = result.id, html = result.html, _eval = result.eval, className = result.className;
            if (document.getElementById(htmID) == null) {
                if (selector == null || selector == '') {
                    var div = document.createElement('section');
                    div.style.display = 'none';
                    div.id = htmID;
                    div.innerHTML = html;
                    div.setAttribute('for', code);
                    if (className != null)
                        div.className = 'module ' + className;
                    else
                        div.className = 'module';
                    document.body.appendChild(div);
                } else {
                    var sel = document.querySelector(selector);
                    if (sel != null) {
                        var div = document.createElement('div');
                        div.style.display = 'none';
                        div.id = htmID;
                        div.innerHTML = html;
                        div.setAttribute('for', code);
                        if (className != null)
                            div.className = 'module ' + className;
                        else
                            div.className = 'module';
                        sel.appendChild(div);
                    } else alert('Cannot find selector: ' + selector);
                }
                if (_eval != null) eval(_eval);
            }
            break;
    }
}

function module_init_event(m) {
    if (m == null) return;
    var id = m.id,
        el = document.getElementById(m.id),
        code = m.code, js, name, form_id;
    if (el == null || code == null) return;
    Array.from(el.querySelectorAll('form')).forEach(function (it, index) {
        if (it.hasAttribute('name')) {
            form_id = id + '_f' + index;
            it.id = form_id;
            it.setAttribute('action', 'javascript:module_submit_form("' + id + '","' + form_id + '");');
        } else {
            it.setAttribute('action', 'javascript:alert("That form miss attribute [name] for submit");');

        }
    });
}

function module_submit_form(module_id, form_id) {
    var el = document.getElementById(form_id);
    if (el == null) return;
    var name_form, code = module_id.split('___')[0];
    if (el.hasAttribute('name')) name_form = el.getAttribute('name');
    if (name_form != null && module_id != null && code != '') {
        var data = {};
        var formElements = el.elements, name;
        for (var i = 0; i < formElements.length; i++) {
            if (formElements[i].type != "submit") {
                name = formElements[i].name;
                if (name != null && name.toString().trim().length != 0) {
                    data[formElements[i].name] = formElements[i].value;
                }
            }
        }
        var module = { state: "submit.form." + name_form, id: module_id, code: code, input: data };
        if (typeof window[module_id].controller == 'function') {
            window[module_id].controller(module);
        }
    }
}

/* TEST MODULE */
//call_api('module_load', { code: 'confirm' });
//call_api('module_load', { code: 'content_edit', config: { c2: true } });
//call_api('module_load', { code: 'folder_edit' });
//call_api('module_load', { code: 'input' });
//call_api('module_load', { code: 'login', config: { c1: true } });
call_api('module_load', { code: 'tree_dir', selector: '#ui-category' });

/* PAGE - LOGIN - ... */
function page_show() {
    var el = document.getElementById('ui-page');
    if (el != null) {
        el.style = '';
    }
}

function page_hide() {
    var el = document.getElementById('ui-page');
    if (el != null) {
        el.style.display = 'none';
    }
}