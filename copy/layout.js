var ___const_Split_Sentence = ['.', ',', '(', ')', 'when', 'that']; 
var ___playRepeat = true;
var ___playAll = true;
var ___isSpeaking = false;
var ___arraySpeak = new Array;
var ___setTimeout = null;
var ___speechText = new SpeechSynthesisUtterance();
___speechText.lang = 'en-US';
___speechText.rate = 1.0;

function ___tree_FormatArticle(text) {
    var htm = '';
    var a = text.split("\r\n");
    htm += '<h2 for=0 do="___speak">' + a[0] + '</h2>';
    ___word_Add(0, a[0]);
    var s, ai, _code, _isCode = false, _k = 1;
    var hii = '';
    for (var i = 1; i < a.length; i++) {
        hii = '';
        s = a[i].trim();
        if (s == '') continue;

        if (s.indexOf('LINK:') == 0) {
            htm += '<em>' + s + '</em>';
            continue;
        }

        if (s.indexOf('Note:') == 0) {
            var ws = api.split(s, ___const_Split_Sentence);
            var ws_count = _.reduce(ws, function (count, val) { return count + (val.trim() === '' ? 0 : 1); }, 0);
            if (ws_count > 1) {
                if (ws[ws.length - 1] == '') ws.splice(ws.length - 1, 1);
                var aSplit = api.split(s, ws);
                if (aSplit[0] == '') aSplit.splice(0, 1);
                for (var ii = 0; ii < ws.length; ii++) { 
                    hii += ___sentence_GeneralTempleWords(ws[ii]);
                    if (ii < aSplit.length)
                        hii += aSplit[ii] + ' ';
                }
                htm += '<div class=g_s><p class="note s_s" for=' + _k + '>' + hii + '</p><b></b></div>';
            } else {
                htm += ___sentence_GeneralTempleWords(s);
            }
            ___word_Add(_k, s);
            _k++;
            continue;
        }

        switch (s) {
            case '//#':
                _isCode = true;
                _code = '';
                break;
            case '//.':
                htm += '<pre>' + _code + '</pre>';
                _isCode = false;
                break;
            default:
                if (_isCode) {
                    _code += s + '\r\n';
                } else {
                    ai = s.split(' ');
                    if (ai.length < 15)
                        htm += '<h3 for=' + _k + ' do="___speak">' + s + '</h3>';
                    else {
                        var ws = api.split(s, ___const_Split_Sentence);
                        var ws_count = _.reduce(ws, function (count, val) { return count + (val.trim() === '' ? 0 : 1); }, 0);
                        if (ws_count > 1) {
                            if (ws[ws.length - 1] == '') ws.splice(ws.length - 1, 1);
                            var aSplit = api.split(s, ws);
                            if (aSplit[0] == '') aSplit.splice(0, 1);
                            for (var ii = 0; ii < ws.length; ii++) {
                                hii += ___sentence_GeneralTempleWords(ws[ii]);
                                if (ii < aSplit.length)
                                    hii += aSplit[ii] + ' ';
                            }
                            //if (_k == 16) {
                            //    console.log(s);
                            //    console.log(ws);
                            //    console.log(aSplit);
                            //    console.log(hii);
                            //}
                            htm += '<div class=g_s><p class=s_s for=' + _k + '>' + hii + '</p><b></b></div>';
                        } else {
                            htm += ___sentence_GeneralTempleWords(s);
                        }
                    }
                    ___word_Add(_k, s);
                    _k++;
                }
                break;
        }
    }
    return htm;
}

function ___sentence_GeneralTempleWords(_sentence) {
    if (_sentence == null || _sentence == '') return '';
    var _aw = _sentence.trim().split(' ');
    var _sen = '', _sp = ' ';
    _aw.forEach(function (_iw, k) {
        if (_iw.length > 3)
            _sen += '<i do=s_word>' + _iw + '</i>';
        else
            _sen += _iw;
        _sen += _sp;
    });
    return '<i do=s_paragraph>' + _sen + '</i><i do=s_w_in_pg></i>';
}

function ___sentence_Counter(text) {

}

var ___storeWords = {};
function ___word_Add(_for, text) {
    if (text == null) return;

    var s, a = text.split(' '), w;
    for (var i = 0; i < a.length; i++) {
        s = a[i].trim().toLowerCase();
        if (s.length > 3) {
            if (s.search(/[^a-zA-Z]+/) === -1) {
                w = ___storeWords[s];
                if (w == null)
                    ___storeWords[s] = { count: 1, id: [_for] };
                else {
                    ___storeWords[s].id.push(_for);
                    ___storeWords[s].count += 1;
                }
            }
        }
    }
}

function ___tab_Content() {
    console.log('___storeWords', ___storeWords);

    var result = _(___storeWords)
        .map(function (v, k) { return _.merge({}, v, { key: k }); })
        .sortBy('count')
        .value();
    result.reverse();
    console.log(result);
    var list = '<ul class="list-group"><li class="list-group-item border-none align-center">' +
        '<a href="#" class="btn btn-default"><i class="glyphicon glyphicon-fast-backward"></i></a>' +
        '<a href="#" class="btn btn-default"><i class="glyphicon glyphicon-backward"></i></a>' +
        '<a href="#" class="btn btn-default hide"><i class="glyphicon glyphicon-stop"></i></a>' +
        '<a href="#" class="btn btn-default"><i class="glyphicon glyphicon-play"></i></a>' +
        '<a href="#" class="btn btn-default hide"><i class="glyphicon glyphicon-pause"></i></a>' +
        '<a href="#" class="btn btn-default"><i class="glyphicon glyphicon-forward"></i></a>' +
        '<a href="#" class="btn btn-default"><i class="glyphicon glyphicon-fast-forward"></i></a>' +
        '</li><li class="list-group-item border-none align-center">' +
        //'<form>' +
        '  <div class="input-group">' +
        '    <input type="text" class="form-control" placeholder="Search">' +
        '    <div class="input-group-btn">' +
        '      <button class="btn btn-default" type="button">' +
        '        <i class="glyphicon glyphicon-search"></i>' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        //'</form>' +
        '</li>';

    result.forEach(function (it, index) { list += '<li class="list-group-item">' + it.key + '<span class="badge">' + it.count + '</span></li>'; });
    list += '</ul>';

    var s =
        '<div class="dx-article-content-tabs">' +
        '   <ul class="nav nav-tabs">' +
        '       <li class="active"><a data-toggle="tab" href="#home"><i class="glyphicon glyphicon-headphones"/> Listen</a></li>' +
        '       <li><a data-toggle="tab" href="#tab_content_word"><i class="glyphicon glyphicon-tag"/> Words</a></li>' +
        //'       <li><a data-toggle="tab" href="#menu1"><i class="glyphicon glyphicon-volume-up"/> Read</a></li>' +
        //'       <li><a data-toggle="tab" href="#menu2"><i class="glyphicon glyphicon-pencil"/> Write</a></li>' +
        //'       <li><a data-toggle="tab" href="#menu3"><i class="glyphicon glyphicon-book"/> Grammar</a></li>' +
        //'       <li><a data-toggle="tab" href="#menu4"><i class="glyphicon glyphicon-bookmark"/> Idom</a></li>' +
        '   </ul>' +
        '   <div class="tab-content">' +
        '       <div id="home" class="tab-pane fade in active">' + list +'</div>' +
        '       <div id="tab_content_word" class="tab-pane fade"></div>' +
        '       <div id="menu2" class="tab-pane fade">' +
        '       </div>' +
        '       <div id="menu3" class="tab-pane fade">' +
        '           <h3>Menu 3</h3>' +
        '           <p>Eaque ipsa quae ab illo inventore verita</p>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    return s;
}

// Get data demo
var ___data_Demo = '';
var request = new XMLHttpRequest();
request.open('GET', '/demo.txt', false);
request.send(null);
if (request.status === 200) ___data_Demo = request.responseText;
var ___data_HTML = '<div class="dx-article-content">' + ___tree_FormatArticle(___data_Demo) + '</div>' + ___tab_Content();



var _tree_HTML = '<div id="tree_data_cache"><details id="tree_data"><summary do="___tree_LoadItems|">Document</summary></details></div>';;
if (localStorage['tree_data_cache'] != null)
    _tree_HTML = localStorage['tree_data_cache'];

$('#layout').w2layout({
    name: 'layout',
    panels: [
        { type: 'top', size: 50, hidden: true, resizable: true, style: 'border:none;padding:0;', content: '' },
        {
            type: 'left', size: 250, resizable: true,
            style: 'border:none;border-right:1px solid #ccc;padding:0 3px 0 0;background: #fff;',
            content: _tree_HTML,
            tabs: {
                active: 'tab_document',
                tabs: [
                    { id: 'tab_document', caption: '<i class="glyphicon glyphicon-folder-open"/> Document' },
                    { id: 'tab_search', caption: '<i class="glyphicon glyphicon-search"/>' },
                    { id: 'tab_bookmark_document', caption: '<i class="glyphicon glyphicon-bookmark"/>' },
                ],
                onClick: function (event) {
                },
                onClose: function (event) {
                }
            },
            toolbar: {
                style: 'border:none;border-right:1px solid #ccc;padding:3px 0 0 0;',
                items: [
                    {
                        type: 'html', id: 'text_search',
                        html: function (item) {
                            var html =
                                '<div style="padding: 3px 10px;">' +
                                ' Search:' +
                                '    <input size="20" placeholder="Input search" onchange="var el = w2ui.toolbar.set(\'item5\', { value: this.value });" ' +
                                '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="' + (item.value || '') + '"/>' +
                                '</div>';
                            return html;
                        }
                    },
                    { type: 'spacer' },
                    { type: 'radio', id: 'item3', group: '1', caption: '', img: 'glyphicon glyphicon-plus', hint: 'Add' },
                    { type: 'radio', id: 'item4', group: '1', caption: '', icon: 'glyphicon glyphicon-pencil', hint: 'Edit' },
                    { type: 'radio', id: 'item5', group: '1', caption: '', icon: 'glyphicon glyphicon-trash', hint: 'Remove' },
                    { type: 'radio', id: 'item6', group: '1', caption: '', icon: 'glyphicon glyphicon-star', hint: 'Bookmark', onClick: function (event) { this.refresh(); } },
                ],
                onClick: function (event) {
                    //this.owner.content('main', event);
                }
            }
        },
        {
            type: 'main', overflow: 'hidden', content: '<div id="ui_main_id"><div class="ui_tab_item" for="tab_home">' + ___data_HTML + '</div></div>',
            style: 'border:none;padding:0;',
            tabs: {
                active: 'tab_home',
                tabs: [{ id: 'tab_home', caption: 'Home' }],
                onClick: function (event) {
                    //w2ui.layout.html('main', 'Active tab: ' + event.target);
                    var _tab_id = event.target;
                    $('.ui_tab_item').hide();
                    $('.ui_tab_item[for="' + _tab_id + '"]').show();
                },
                onClose: function (event) {
                    this.click('tab_home');
                }
            },
            toolbar: {
                style: 'border:none;border-right:1px solid #ccc;padding:3px 0 0 0;background: #fff;',
                items: [
                    { type: 'radio', id: 'btn_article_content_player_fast-backward', group: '1', caption: '', icon: 'glyphicon glyphicon-step-backward', onClick: function (event) { } },
                    { type: 'radio', id: 'btn_article_content_player_backward', group: '1', caption: '', icon: 'glyphicon glyphicon-backward', onClick: function (event) { ___speakPrev(); } },
                    { type: 'radio', id: 'btn_article_content_player_stop', group: '1', caption: '', icon: 'glyphicon glyphicon-stop', onClick: function (event) { ___speakStop(); } },
                    { type: 'radio', id: 'btn_article_content_player_play', group: '1', caption: '', icon: 'glyphicon glyphicon-play', onClick: function (event) { ___speakPlay(); } },
                    { type: 'radio', id: 'btn_article_content_player_pause', group: '1', caption: '', icon: 'glyphicon glyphicon-pause', onClick: function (event) { ___speakPause(); } },
                    { type: 'radio', id: 'btn_article_content_player_forward', group: '1', caption: '', icon: 'glyphicon glyphicon-forward', onClick: function (event) { ___speakNext() } },
                    { type: 'radio', id: 'btn_article_content_player_fast-forward', group: '1', caption: '', icon: 'glyphicon glyphicon-step-forward', onClick: function (event) { ; } },
                    { type: 'break' },
                    {
                        type: 'check', id: 'check_repeate', text: 'Repeat', icon: 'glyphicon glyphicon-repeat', checked: true, onClick: function (event) {
                            if (___playRepeat)
                                ___playRepeat = false;
                            else
                                ___playRepeat = true;
                        }
                    },
                    {
                        type: 'radio', group: '1', id: 'check_playall', text: 'PlayAll', icon: 'glyphicon glyphicon-play-circle', onClick: function (event) {
                            if (___playAll)
                                ___playAll = false;
                            else
                                ___playAll = true;
                        }
                    },
                    { type: 'break' },
                    {
                        type: 'html', id: 'label_message_player_',
                        html: '<div id="label_message_player" class=label_message_player>asdasd</div>'
                    },
                    { type: 'spacer' },
                    { type: 'radio', id: 'item3', group: '1', caption: '', img: 'glyphicon glyphicon-plus', hint: 'Add' },
                    { type: 'radio', id: 'item4', group: '1', caption: '', icon: 'glyphicon glyphicon-pencil', hint: 'Edit' },
                    { type: 'radio', id: 'item5', group: '1', caption: '', icon: 'glyphicon glyphicon-trash', hint: 'Remove' },
                    { type: 'radio', id: 'item6', group: '1', caption: '', icon: 'glyphicon glyphicon-star', onClick: function (event) { ; } },
                    { type: 'break' },
                    { type: 'radio', id: 'btn_article_content_player_down', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-down', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_up', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-up', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_off', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-off', onClick: function (event) { ; } },
                    //{
                    //    type: 'html', id: 'text_search',
                    //    html: function (item) {
                    //        var html =
                    //            '<div style="padding: 3px 10px;">' +
                    //            ' Search:' +
                    //            '    <input size="20" placeholder="Input search" onchange="var el = w2ui.toolbar.set(\'item5\', { value: this.value });" ' +
                    //            '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="' + (item.value || '') + '"/>' +
                    //            '</div>';
                    //        return html;
                    //    }
                    //},
                ],
                onClick: function (event) {
                    //this.owner.content('main', event);
                }
            }
        },
        {
            type: 'preview', size: '30%', resizable: true, hidden: true,
            style: 'border:none;padding:0;background: #fff;', content: '',
            tabs: {
                active: 'tab_bookmark_listen',
                tabs: [
                    { id: 'tab_bookmark_listen', caption: '<i class="glyphicon glyphicon-star"/> Listen' },
                    { id: 'tab_bookmark_read', caption: '<i class="glyphicon glyphicon-star"/> Read' },
                    { id: 'tab_bookmark_write', caption: '<i class="glyphicon glyphicon-star"/> Write' },
                    { id: 'tab_bookmark_grammar', caption: '<i class="glyphicon glyphicon-star"/> Grammar' },
                    { id: 'tab_bookmark_idom', caption: '<i class="glyphicon glyphicon-star"/> Idom' },
                    { id: 'tab_bookmark_word', caption: '<i class="glyphicon glyphicon-star"/> Words' },
                ],
                onClick: function (event) {
                },
                onClose: function (event) {
                }
            },
            toolbar: {
                style: 'border:none;border-right:1px solid #ccc;padding:3px 0 0 0;',
                items: [
                    {
                        type: 'html', id: 'text_search',
                        html: function (item) {
                            var html =
                                '<div style="padding: 3px 10px;">' +
                                ' Search:' +
                                '    <input size="20" placeholder="Input search" onchange="var el = w2ui.toolbar.set(\'item5\', { value: this.value });" ' +
                                '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="' + (item.value || '') + '"/>' +
                                '</div>';
                            return html;
                        }
                    },
                    { type: 'spacer' },
                    { type: 'radio', id: 'item3', group: '1', caption: '', img: 'glyphicon glyphicon-plus', hint: 'Add' },
                    { type: 'radio', id: 'item4', group: '1', caption: '', icon: 'glyphicon glyphicon-pencil', hint: 'Edit' },
                    { type: 'radio', id: 'item5', group: '1', caption: '', icon: 'glyphicon glyphicon-trash', hint: 'Remove' },
                    { type: 'radio', id: 'item6', group: '1', caption: '', icon: 'glyphicon glyphicon-star', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'break' },
                    { type: 'radio', id: 'btn_article_content_player_fast-backward', group: '1', caption: '', icon: 'glyphicon glyphicon-fast-backward', hint: 'Bookmark', onClick: function (event) { } },
                    { type: 'radio', id: 'btn_article_content_player_backward', group: '1', caption: '', icon: 'glyphicon glyphicon-backward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_stop', group: '1', caption: '', icon: 'glyphicon glyphicon-stop', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_play', group: '1', caption: '', icon: 'glyphicon glyphicon-play', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_pause', group: '1', caption: '', icon: 'glyphicon glyphicon-pause', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_forward', group: '1', caption: '', icon: 'glyphicon glyphicon-forward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_fast-forward', group: '1', caption: '', icon: 'glyphicon glyphicon-fast-forward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'break' },
                    { type: 'radio', id: 'btn_article_content_player_down', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-down', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_up', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-up', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_off', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-off', hint: 'Bookmark', onClick: function (event) { ; } },
                ],
                onClick: function (event) {
                    //this.owner.content('main', event);
                }
            }
        },
        {
            type: 'right', size: '40%', resizable: true, hidden: true, style: 'border:none;padding:0;', content: '',
            tabs: {
                active: 'tab_bookmark_listen',
                tabs: [
                    { id: 'tab_bookmark_listen', caption: '<i class="glyphicon glyphicon-headphones"/> Listen' },
                    { id: 'tab_bookmark_read', caption: '<i class="glyphicon glyphicon-volume-up"/> Read' },
                    { id: 'tab_bookmark_write', caption: '<i class="glyphicon glyphicon-pencil"/> Write' },
                    { id: 'tab_bookmark_grammar', caption: '<i class="glyphicon glyphicon-book"/> Grammar' },
                    { id: 'tab_bookmark_idom', caption: '<i class="glyphicon glyphicon-bookmark"/> Idom' },
                    { id: 'tab_bookmark_word', caption: '<i class="glyphicon glyphicon-tag"/> Words' },
                ],
                onClick: function (event) {
                },
                onClose: function (event) {
                }
            },
            toolbar: {
                style: 'border:none;border-right:1px solid #ccc;padding:3px 0 0 0;',
                items: [
                    {
                        type: 'html', id: 'text_search',
                        html: function (item) {
                            var html =
                                '<div style="padding: 3px 10px;">' +
                                ' Search:' +
                                '    <input size="20" placeholder="Input search" onchange="var el = w2ui.toolbar.set(\'item5\', { value: this.value });" ' +
                                '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="' + (item.value || '') + '"/>' +
                                '</div>';
                            return html;
                        }
                    },
                    { type: 'spacer' },
                    { type: 'radio', id: 'item3', group: '1', caption: '', img: 'glyphicon glyphicon-plus', hint: 'Add' },
                    { type: 'radio', id: 'item4', group: '1', caption: '', icon: 'glyphicon glyphicon-pencil', hint: 'Edit' },
                    { type: 'radio', id: 'item5', group: '1', caption: '', icon: 'glyphicon glyphicon-trash', hint: 'Remove' },
                    { type: 'radio', id: 'item6', group: '1', caption: '', icon: 'glyphicon glyphicon-star', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'break' },
                    { type: 'radio', id: 'btn_article_content_player_fast-backward', group: '1', caption: '', icon: 'glyphicon glyphicon-fast-backward', hint: 'Bookmark', onClick: function (event) { } },
                    { type: 'radio', id: 'btn_article_content_player_backward', group: '1', caption: '', icon: 'glyphicon glyphicon-backward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_stop', group: '1', caption: '', icon: 'glyphicon glyphicon-stop', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_play', group: '1', caption: '', icon: 'glyphicon glyphicon-play', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_pause', group: '1', caption: '', icon: 'glyphicon glyphicon-pause', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_forward', group: '1', caption: '', icon: 'glyphicon glyphicon-forward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_fast-forward', group: '1', caption: '', icon: 'glyphicon glyphicon-fast-forward', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'break' },
                    { type: 'radio', id: 'btn_article_content_player_down', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-down', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_up', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-up', hint: 'Bookmark', onClick: function (event) { ; } },
                    { type: 'radio', id: 'btn_article_content_player_off', group: '1', caption: '', icon: 'glyphicon glyphicon-volume-off', hint: 'Bookmark', onClick: function (event) { ; } },
                ],
                onClick: function (event) {
                    //this.owner.content('main', event);
                }
            }
        },
        { type: 'bottom', size: 44, resizable: true, hidden: true, style: 'border:none;padding:0;', content: '' }
    ]
});

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

function ___speakComplete() {
    console.log('complete');
    $('*[do="___speak"]').css('background-color', '');
    $('*[do="___speakw"]').css('background-color', '');
    ___isSpeaking = false;
    ___arraySpeak = new Array;
}

function ___speakStop() {
    console.log('stop');
    speechSynthesis.cancel();
    ___speakComplete();
}

function ___speakPlay() {
    console.log('play');
    speechSynthesis.resume();
}

function ___speakPause() {
    console.log('pause');
    if (speechSynthesis.paused == true)
        speechSynthesis.pause();
}

function ___speakw(ele, eventName, para) {
    if (ele == null) return;

    if (___speakRunning()) {
        return;
    }

    $('*[do="___speak"]').css('background-color', '');

    var _text = ele.innerText;
    ele.style.backgroundColor = 'yellow'; 
    console.log(_text);
    ___arraySpeak = new Array;
    ___arraySpeak.push(_text);
    console.log('___arraySpeak', ___arraySpeak); 
    ___speakDo();
}

function ___speak(ele, eventName, para) {
    if (ele == null) return;

    if (___speakRunning()) {
        return;
    }

    $('*[do="___speak"]').css('background-color', '');

    var _text = ele.innerText;
    ele.style.backgroundColor = 'yellow';
    ___arraySpeak = new Array;
    var a = _text.split(/[.,]+/);
    for (var i = 0; i < a.length; i++)
        if (a[i].trim() != '') ___arraySpeak.push(a[i].trim());
    console.log('___arraySpeak', ___arraySpeak);
    var id = 0;
    if (ele.hasAttribute('for'))
        id = ele.getAttribute('for');
    sessionStorage['speak_for'] = id;
    ___speakDo();
}

function ___speakDo() {
    ___isSpeaking = true;
    var _text = ___arraySpeak[0];
    ___arraySpeak.splice(0, 1);
    console.log(_text);
    ___speechText.text = _text;
    ___speechText.onend = function () {
        if (___arraySpeak.length == 0) {
            ___isSpeaking = false;
            clearTimeout(___setTimeout);
            ___setTimeout = null;
            ___speakComplete();
        } else {
            clearTimeout(___setTimeout);
            ___setTimeout = setTimeout(___speakDo, 1000);
        }
    };
    speechSynthesis.speak(___speechText);
}

function ___speakPrev() {
    var id = sessionStorage['speak_for'];
    if (id != null && id != '' && ___speakRunning() == false) {
        var _for = parseInt(id) - 1;
        if (_for < 0) return;
        var ele = document.querySelector('.dx-article-content *[for="' + _for + '"]');
        if (ele != null)
            ___speak(ele, null, null);
    }
}

function ___speakNext() {
    var id = sessionStorage['speak_for'];
    if (id != null && id != '' && ___speakRunning() == false) {
        var _for = parseInt(id) + 1;
        var ele = document.querySelector('.dx-article-content *[for="' + _for + '"]');
        if (ele != null)
            ___speak(ele, null, null);
    }
}

function ___speakRunning() {
    if (___isSpeaking)
    {
        var el = document.getElementById('label_message_player');
        el.innerHTML = 'SPEAKING ... !';
        el.style.display = 'block';
        setTimeout(function () { el.style.display = 'none'; }, 1000);
        return true;
    }
    return false;
}

/************************************************/
/* SPEECH */
/************************************************/

/* valid element clicked to speech */
function s_valid(ele) {
    if (ele == null) return false;
    if (___speakRunning()) return false;
    var text = ele.innerText;
    if (text == null || text.trim().length == 0) return false;
    return true;
}

/* speech paragraph */
function s_paragraph(ele, eventName, para) {
    if (s_valid(ele)) {
        var text = ele.innerText.trim();
        console.log(text);
    }
}

/* speech word of paragraph */
function s_w_in_pg(ele, eventName, para) {
    if (ele == null) return;
    var _ele = ele.previousSibling;
    var _sen = '';
    $(_ele).find('i[do="s_word"]').each(function () {
        _sen += $(this).text() + ' ';
    });
    console.log(_sen);    
}