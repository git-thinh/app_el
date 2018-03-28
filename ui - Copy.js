
String.prototype.createID = function () { return this.split('/').join('_').split('"').join('_').split('\'').join('_').split(':').join('_').split(' ').join('_'); }

/****************************************************************************/
/* VARIABLE */

var _CACHE = {};

var _TOAST_SPEECH = true;
var _READING = false;

var _PANEL_TREE = document.getElementById('ui-category');
var _PANEL_TAB = document.getElementById('ui-tabs');

var _TRANSLATE = true;

var _DELAY_WORDS = 1000;
var _DELAY_SENTENCE = 3000;
var _DELAY_PARAGRAPH = 5000;

var _TAG_ARTICLE = "ARTICLE";
var _TAG_TITLE = "H2";
var _TAG_HEADING = "H3";
var _TAG_NOTE = "SPAN";
var _TAG_PARAGRAPH = "P";
var _TAG_SENTENCE = "B";
var _TAG_CLAUSE = "EM";
var _TAG_WORD = "I";

var _SPEECH_TYPE = (localStorage['_SPEECH_TYPE'] == null ? 'SPEECH_WORD' : localStorage['_SPEECH_TYPE']);
if (localStorage['_SPEECH_TYPE'] != 'SPEECH_WORD') Array.from(document.querySelector('input[name="speech_type"]')).forEach(function (_it) {
    if (_it.getAttribute('value') == localStorage['_SPEECH_TYPE'])
        _it.setAttribute('checked', 'checked');
    else if (_it.hasAttribute('checked'))
        _it.removeAttribute('checked');
});

var _WORKER = new Worker('worker.js');
_WORKER.onmessage = event_processMessage;
window.onclick = event_elementClick;
window.ondblclick = event_elementDblClick;
var postMessage = function (msg) { _WORKER.postMessage(msg); }

/****************************************************************************/
/* EVENT */

function ERROR_CONNECT_API() {
    //document.getElementById('dialog_Alert').show();
}

var _timer_SYSTEM_READY = null;
function SYSTEM_READY(m) {
    var page = document.getElementById('ui-page');
    if (page != null) {
        if (_timer_SYSTEM_READY != null) {
            clearTimeout(_timer_SYSTEM_READY);
            _timer_SYSTEM_READY = null;
        }
        page.style.display = 'flex';
        console.log('SYSTEM_READY');

        postMessage({ action: 'GRAM_ALL_KEY', callback: 'tab_Gram_BindList' });
    } else {
        _timer_SYSTEM_READY = setTimeout(SYSTEM_READY, 50);
    }
}

function event_processMessage(event) {
    var it = event.data;
    if (typeof it === 'string') { } else {
        if (it.ok) {
            var _func = it.callback;
            if (typeof window[_func] === 'function')
                window[_func](it);
        } else {
            if (it.msg != null) { toast(it.msg); }
        }
    }
}

function event_elementClick(event) {
    var _el = event.target;
    console.log('CLICK: ', _el);
    var _do = _el.closest('*[do]');
    if (_do != null) {
        var _func = _do.getAttribute('do');
        functionExecute(_el, _func);
    } else {
        var _isArticale = false, _text = '';
        var _pa = _el.closest('*[for]');
        if (_pa != null) {
            var _for = _pa.getAttribute('for');
            switch (_for) {
                case '_CONFIG_TYPE_SPEECH':
                    var _val = _el.getAttribute('value');
                    if (_val != null && _val.indexOf('SPEECH_') != -1) {
                        _SPEECH_TYPE = _val;
                        localStorage['_SPEECH_TYPE'] = _SPEECH_TYPE;
                        if (_pa.hasAttribute('open')) _pa.removeAttribute('open');
                    }
                    break;
                case '_ARTICLE': case '_TAB_DETAIL':
                    _isArticale = true;
                    var _target, _tagName = _el.tagName;
                    if (_el.tagName == _TAG_PARAGRAPH) {
                        _text = _el.innerText;
                    } else
                        switch (_SPEECH_TYPE) {
                            case 'SPEECH_WORD':
                                _text = _el.innerText;
                                break;
                            case 'SPEECH_CLAUSE':
                                _target = _el.closest(_TAG_CLAUSE);
                                if (_target != null)
                                    _text = _target.innerText;
                                else
                                    _text = _el.innerText.split('.')[0];
                                break;
                            case 'SPEECH_SENTENCE':
                                _target = _el.closest(_TAG_SENTENCE);
                                if (_target != null)
                                    _text = _target.innerText;
                                break;
                            case 'SPEECH_PARAGRAPH':
                                _target = _el.closest(_TAG_PARAGRAPH);
                                if (_target != null)
                                    _text = _target.innerText;
                                break;
                        }
                    if (_for == '_TAB_DETAIL') _text = _el.innerText;

                    if (_text != null && _text.length > 0) {
                        var rs = document.querySelector('._READING');
                        if (rs != null) rs.className = '';
                        if (_SPEECH_TYPE == 'SPEECH_WORD')
                            _el.className = '_READING';
                        else {
                            if (_target == null)
                                _el.className = '_READING';
                            else _target.className = '_READING';
                        }

                        console.log(_SPEECH_TYPE, _text);
                        _speech_Text(_text);
                    }
                    break;
            }
        }
        if (!_isArticale) {
            //_text = _el.innerText.trim();
            //if (_TOAST_SPEECH && _text != null && _text.trim().length > 0) {
            //    toast(_text, 9000);
            //    console.log(_SPEECH_TYPE, _text);
            //    _speech_Text(_text);
            //}
        }
    }
    //event.preventDefault();
}

function event_elementDblClick(event) {
    //api.callback(event.target, 'dblclick');
    console.log('DBLCLICK: ', event.target);
}

/****************************************************************************/
/* UI */

function tab_Gram_BindList(m) {
    var li = '<ul class="list-checkbox">';
    Array.from(m.result).forEach(function (_it, _index) {
        var id = '^detail.' + _it.createID() + '.S.H';
        sessionStorage[id] = 'hide';
        var m = { id: _it, action: 'GRAM_DETAIL_BY_KEY', callback: 'tab_Gram_BindDetail', selector: id };
        _CACHE[id] = m;
        li += '<li><i></i><span do="postMessage|' + id + '">' + _it + '</span><div class="hide grammar_detail" id=' + id + '></div></li>';
    });
    li += '</ul>';
    document.getElementById('tab_grammar').innerHTML = li;
}

function tab_Gram_BindDetail(m) {
    console.log(m);
    var eDetail = document.getElementById(m.selector);
    if (eDetail != null) {
        var o = m.result;
        if (o != null) {
            Array.from(document.querySelector('.grammar_detail')).forEach(function (_it) { _it.style.display = 'none'; });
            eDetail.innerHTML =
                '<h3><a>' + o.Struct.split('|').join('</a><br><a>') + '</a></h3>' +
                '<h5><a>' + o.Explain.split('|').join('</a><br><a>') + '</a></h5>' +
                '<p><a>' + o.Example.split('|').join('</a><br><a>') + '</a></p>';
            eDetail.style.display = 'block';
            sessionStorage[m.selector] = 'show';
        }
    }
}

function tab_Open(elem) {
    if (elem == null) return;
    var i, _tabName = (elem.hasAttribute('for') ? elem.getAttribute('for') : '');
    if (_tabName == '') return;

    Array.from(elem.closest('.tab-box').querySelectorAll('.tab-content')).forEach(function (val) {
        val.style.display = 'none';
    });

    Array.from(elem.parentElement.querySelectorAll('button')).forEach(function (val) {
        val.className = '';
    });

    var _con = document.getElementById(_tabName);
    if (_con != null) _con.style.display = 'block';
    elem.className = "active";
}
tab_Open(document.querySelector('button[for="tab_grammar"]'));

function _speech_Text(text) {
    _WORKER.postMessage(text);
}

function event_mousemove_Word_Sentence_Paragraph(e) {
    e.target.style.backgroundColor = 'yellow';
}

var _timer_toast = null;
function toast(text, _timeOut) {
    if (text == null || text.trim().length == 0) return;

    console.log(text);
    var _toast = document.getElementById("toast");
    if (_toast != null) {
        _toast.innerHTML = text;
        _toast.className = "show";
        if (_timeOut == null) _timeOut = 2000;
        clearTimeout(_timer_toast);
        _timer_toast = setTimeout(function () {
            _toast.className = _toast.className.replace("show", "");
            clearTimeout(_timer_toast);
        }, _timeOut);
    }
}

function functionExecute(_el, para) {
    var a = para.split('|');
    var _func = a[0], p = null;
    if (a.length > 1)
        p = para.substring(_func.length + 1, para.length);

    if (typeof window[_func] === 'function') {
        if (p == null)
            window[_func](_el);
        else {
            p = p.toString().trim();
            if (p.indexOf('.S.H') != -1) {
                if (sessionStorage[p] == 'show') {
                    var _target = document.getElementById(p);
                    if (_target != null) {
                        _target.style.display = 'none';
                        sessionStorage[p] = 'hide';
                        return;
                    }
                }
            }
            if (p[0] == '^') {
                var val = _CACHE[p];
                window[_func](val);
            } else
                window[_func](_el, p);
        }
    }
}
/****************************************************************************/
/* PANEL TAB - PANEL TREE */

if (localStorage['_PANEL_TREE'] != null)
    _PANEL_TREE.style.display = localStorage['_PANEL_TREE'];
function ui_toggleTree(elem) {
    if (isHidden(_PANEL_TREE)) {
        // HIDE => SHOW
        _PANEL_TREE.style.display = 'block';
        localStorage['_PANEL_TREE'] = 'block';
    } else {
        // SHOW => HIDE
        _PANEL_TREE.style.display = 'none';
        localStorage['_PANEL_TREE'] = 'none';
    }
}

/* PANEL TAB */
if (localStorage['_PANEL_TAB'] != null)
    _PANEL_TAB.style.display = localStorage['_PANEL_TAB'];
function ui_toggletTab(elem) {
    if (isHidden(_PANEL_TAB)) {
        // HIDE => SHOW
        _PANEL_TAB.style.display = 'block';
        localStorage['_PANEL_TAB'] = 'block';
    } else {
        // SHOW => HIDE
        _PANEL_TAB.style.display = 'none';
        localStorage['_PANEL_TAB'] = 'none';
    }
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}