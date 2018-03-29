//window.console.log = function (title, data) { };
String.prototype.createID = function () { return this.split('/').join('_').split('"').join('_').split('\'').join('_').split(':').join('_').split(' ').join('_'); }
Object.prototype.generateID = function () { var id = new Date().getTime().toString(); if (this.hasAttribute('id')) { id = this.getAttribute('id'); } else { this.setAttribute('id', id); } return id; }

var _API_OPEN = false;

var _WORKER = new Worker('worker.js');
var ui = {
    m_elem_current_id: null,
    m_form_current: null,
    on_message_worker: function (e) {
        console.log('WORK -> UI: ', e.data);
        var m = e.data;
        if (typeof m === 'string') {
        } else { ui.f_callback(m.callback, m); }
    },
    on_dom_click: function (e) {
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
                    var id = el.generateID();
                    ui.m_elem_current_id = id;
                    var rs = {};
                    var m = { callback: el.getAttribute('do'), selector: id };
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
        console.log('UI.CALLBACK: ', para);
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
                if (exist) {
                    if (m == null) { m = {}; }
                    if (a.length > 1) {
                        var pr = new Array;
                        a.forEach(function (it, index) { if (index != 0) { pr.push(it); } });
                        m.para = pr;
                    }
                    fi(m);
                } else {
                    console.log('ERROR: cannot find function: ' + func + ' in check exist');
                }
            }
        }
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
                var pa = el.parentElement;
                if (pa.tagName == 'DETAILS') {
                    /* Load subfolder and files */
                    var img = document.createElement('img');
                    img.id = m.selector + '.loading';
                    img.src = '/indicator.gif';
                    img.style.width = '100%';

                    pa.appendChild(img);
                    m.action = 'TREE_NODE';
                    m.callback = 'tree.rs_node_click';
                    var input;
                    if (m.para == null || m.para.length == 0) {
                        input = { folder: '', path: '' };
                    } else {

                    }
                    m.input = input;
                    ui.f_post(m);
                } else if (el.tagName == 'LI') {
                    /* Load content file */
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
                    var s = '<ul>';
                    Array.from(m.result.dirs).forEach(function (it) {
                        if (it.count > 0) {
                            s += '<li><details><summary do="tree.on_node_click|' + it.name + '">' + it.name + '(' + it.count + ')</summary></li>';
                        } else {
                            s += '<li class="dir-empty">' + it.name + '</li>';
                        }
                    });
                    Array.from(m.result.files).forEach(function (it) {
                        s += '<li class="file" do="tree.on_node_click|' + it.name + '|' + it.type + '">' + it.title + '</li>';
                    });
                    s += '</ul>';

                    var div = document.createElement('div');
                    div.innerHTML = s;
                    el.parentElement.appendChild(div);
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
_WORKER.onmessage = ui.on_message_worker;
window.onclick = ui.on_dom_click;