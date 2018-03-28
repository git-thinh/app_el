//window.console.log = function (title, data) { };
String.prototype.createID = function () { return this.split('/').join('_').split('"').join('_').split('\'').join('_').split(':').join('_').split(' ').join('_'); }
Object.prototype.generateID = function () { var id = new Date().getTime().toString(); if (this.hasAttribute('id')) { id = this.getAttribute('id'); } else { this.setAttribute('id', id); } return id; }

/****************************************************************************/
/* VARIABLE */
var _API_OPEN = false;

/****************************************************************************/
var _WORKER = new Worker('worker.js');
var ui = {
    m_elem_current_id: null,
    m_form_current: null,
    on_message_worker: function (e) {
        console.log('UI: ', e.data);
        var m = e.data;
        if (typeof m === 'string') {
        } else { ui.f_callback(m.callback, m); }
    },
    on_click_ui: function (e) {
        var el = e.target;
        console.log('UI.CLICK: ', el.tagName);
        if (el.hasAttribute('type') && el.getAttribute('type') == 'submit') {
            ui.m_elem_current_id = el.generateID();
            ui.m_form_current = el.closest('form');
        } else {
            ui.m_form_current = null;
            var el = document.getElementById('null');
            if (el == null) el = e.target;
            if ((el.innerText == 'Cancel' || el.innerText == 'Ok') && el.tagName == 'BUTTON') { ui.dialog.f_cancel(el); } else {
                if (el.hasAttribute('do')) {
                    ui.m_elem_current_id = el.generateID();
                    var rs = {};
                    var m = { callback: el.getAttribute('do'), element: el };
                    ui.f_callback(m.callback, m);
                }
            }
        }
    },
    f_post: function (m) { _WORKER.postMessage(m); },
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
        console.log(para);
        var s = '';
        if (typeof para === 'string') { s = para; } else {
            alert('f_callback() ????');
        }
        if (s != '') {
            var a = s.split('|'), func = a[0].trim();
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
                if (exist) { fi(m); } else {
                    console.log('ERROR: cannot find function: ' + func + ' in check exist');
                }
            }
        }
    },
    dialog: {
        f_get_data: function (el) {
            var data;
            var mod = el.closest('section');
            if (mod != null) {
                var name, value, type;
                data = {}
                Array.from(mod.querySelectorAll('input, textarea')).forEach(function (it) {
                    value = null;
                    if (it.hasAttribute('name')) {
                        name = it.getAttribute('name');
                        switch (it.tagName) {
                            case 'INPUT':
                                if (it.hasAttribute('type')) {
                                    type = it.getAttribute('type');
                                    switch (type) {
                                        case 'text': case 'password': case 'email': case 'number':
                                            if (it.hasAttribute('value')) { value = it.getAttribute('value'); }
                                            break;
                                        case 'checkbox':
                                            break;
                                        case 'radio':
                                            break;
                                    }
                                }
                                break;
                            case 'TEXTAREA':
                                value = it.innerHTML;
                                break;
                        }
                        if (value != null) { data[name] = value; }
                    }
                });
            }
            return data;
        },
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
            var el = document.getElementById('ui-alert');
            if (el != null) {
                el.style = '';
                el.querySelector('p').innerHTML = msg;
                if (title != null) {
                    el.querySelector('h3').innerHTML = title;
                    if (title.toLowerCase() == 'error') {
                        el.style.backgroundColor = 'red';
                    } else {
                        el.style.backgroundColor = '#fff';
                    }
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
        f_login_click: function (m) {
            m.action = 'USER_LOGIN';
            m.callback = 'user.f_login_result';
            console.log(m);
            ui.user.f_login_hide();
            ui.dialog.f_indicator_show('System authentication account ...');
            ui.f_post(m);
        },
        f_login_result: function (m) {
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
            ui.page.f_set_test_env();

            //ui.dialog.f_indicator_hide();
            //ui.user.f_login_show();

            ui.page.f_show();
        },
        f_set_test_env: function () {
            document.querySelector('input[type="password"]').setAttribute('value', 'admin');
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
_WORKER.onmessage = ui.on_message_worker;
window.onclick = ui.on_click_ui;