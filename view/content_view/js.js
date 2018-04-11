var ___module_id = {
    init: function (module) { },
    build_clause_sentence: function (text, row_id, en_vi) {
        if (en_vi == true) return text;

        //b: sentence, em: clause, i: word
        var p = '', split_clause = [':', '=', ',', '(', ')', 'when', 'that', 'from', 'of'],
            ac, ac2, aw, ss = '', sc = '', sw = '', cid = 0, sp;
        text.split('.').forEach(function (si, k) {
            if (si.length > si.replace(/[^\x20-\x7E]+/g, '').length) {
                //vietnamese
                ss += '<v>' + si.trim() + '.</v>';
            } else {
                //english
                ac = _split(si, split_clause);
                if (ac[ac.length - 1] == '') ac.splice(ac.length - 1, 1);
                ac2 = _split(si, ac);
                sc = '';
                cid = 0;
                ac.forEach(function (ci, index) {
                    cid = index + 1;
                    sw = '';
                    ci.split(' ').forEach(function (wi) { if (wi.length > 0) { if (wi.length > 3) { sw += '<i>' + wi + '</i>'; } else { sw += '<d>' + wi + '</d>'; } } });
                    sc += '<em>' + sw + '</em> ';
                    if (cid < ac2.length) {
                        sp = ac2[cid].trim();
                        if (sp.length != 0) {
                            if (sp.length > 1)
                                sc += '<d>' + sp + '</d>';
                            else
                                sc += '<e>' + sp + '</e>';
                        }
                    }
                });
                if (k > 0) ss += '<e>. </e>';
                ss += '<b>' + sc + '</b>';
                //if (row_id == 10) { console.log(si, ac); console.log(si, ac2); }
            }
        });
        ss = ss.split('</em> ').join('</em>').split('  ').join(' ');
        //if (row_id == 10) console.log(row_id + '.' + text + ' = ', ss);
        return ss;
    },
    is_text_vietnamese: function (s) {
        var en_vi = false;
        var avi = ['à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ', 'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ', 'ì', 'í', 'ị', 'ỉ', 'ĩ', 'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ', 'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ', 'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ', 'đ']
        for (var i = 0; i < avi.length; i++) { if (s.indexOf(avi[i]) != -1) { en_vi = true; break; } }
        return en_vi;
    },
    message: function (m) {
        console.log('UI.MODULE.broadcast: ', m);
        if (m == null || m.action == null) return;
        switch (m.action) {
            case 'tree_hide':
                {
                    var btn_tree_show = document.querySelector('#___module_id li.tree_show');
                    if (btn_tree_show != null) {
                        btn_tree_show.style = '';
                    }
                }
                break;
            case 'file_load':
                {
                    if (m == null || m.action != 'file_load' || m.result == null || m.result.ok == false || m.result.text == null) return;
                    var el = document.getElementById('ui-article');
                    if (el != null) {
                        var htm = '<article class=ext_txt>', ext = m.result.extension, s = m.result.text, a = _split(s, ['\r', '\n']), isCode = false;

                        if (ext == '.html') {                           
                            el.innerHTML = '<article class=ext_html>' + '<h1>' + m.input.file_name + '</h1>' + s + '</article>';
                            el.scrollTop = 0;
                            return;
                        }

                        var en_vi = this.is_text_vietnamese(s), si = '', c0, lang = 'e',
                            isList = false;

                        for (var i = 0; i < a.length; i++) {
                            si = a[i];
                            if (i == 0) htm += '<h1>' + this.build_clause_sentence(si, i, en_vi) + '</h1>'; else {
                                switch (si[0]) {
                                    case '■': // h3
                                        si = si.substring(1, si.length).trim();
                                        htm += '<h3>' + this.build_clause_sentence(si, i, en_vi) + '</h3>';
                                        break;
                                    case '⌐': // ul, ol
                                        si = si.substring(1, si.length).trim();
                                        isList = true;
                                        htm += '<ul>';
                                        break;
                                    case '•': // li
                                        si = si.substring(1, si.length).trim();
                                        if (isList) {
                                            htm += '<li>' + this.build_clause_sentence(si, i, en_vi) + '</li>';
                                        } else {
                                            htm += '<p>' + this.build_clause_sentence(si, i, en_vi) + '</p>';
                                        }
                                        break;
                                    case '┘': // end ul,ol
                                        si = si.substring(1, si.length).trim();
                                        isList = false;
                                        htm += '</ul>';
                                        break;
                                    case '^': // pre
                                        si = si.substring(1, si.length).trim();
                                        isCode = true;
                                        htm += '<pre>';
                                        break;
                                    case 'ⱽ': // end pre
                                        si = si.substring(1, si.length).trim();
                                        isCode = false;
                                        htm += '</pre>';
                                        break;
                                    default:
                                        if (si.trim().length > 0) {
                                            if (isCode) {
                                                htm += si + '\r\n';
                                            } else {
                                                si = si.trim();
                                                c0 = si.substring(0, 2);
                                                if (c0 == 'I.' || c0 == 'II' || c0 == 'V.' || c0 == 'IV' || c0 == 'VI' ||
                                                    c0 == 'A.' || c0 == 'B.' || c0 == 'C.' || c0 == 'D.' || c0 == 'E.' || c0 == 'F.' || c0 == 'G.' || c0 == 'H.') {
                                                    htm += '<h3>' + si + '</h3>';
                                                } else {
                                                    lang = 'e';
                                                    if (si.length > si.replace(/[^\x20-\x7E]+/g, '').length) {
                                                        lang = 'v';
                                                        if (si.split('.').length > 1) lang += ' p';
                                                    }
                                                    if (si[0] == '-')
                                                        htm += '<p class="' + lang + ' b">' + this.build_clause_sentence(si, i, en_vi) + '</p>';
                                                    else
                                                        htm += '<p class="' + lang + '">' + this.build_clause_sentence(si, i, en_vi) + '</p>';
                                                }
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                        htm += '</article>';
                        el.innerHTML = htm;
                        el.scrollTop = 0;
                    }
                }
                break;
        }
    },
    controller: function (module) {
        var state = module.state,
            id = module.id,
            data = module.data;
        var el = document.getElementById(id);
        if (el == null) return;

        switch (state) {
            case 'load':
                if (localStorage['tree_display'] == null) localStorage['tree_display'] = 'block';
                if (localStorage['tree_display'] == 'none') {
                    var btn_tree_show = document.querySelector('#' + id + ' li.tree_show');
                    if (btn_tree_show != null) {
                        btn_tree_show.style = '';
                    }
                }

                el.style.display = '';
                var tree_node_root = document.getElementById('tree_node_root');
                if (tree_node_root) tree_node_root.click();
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    on_search_click: function (keyword) {
        console.log(keyword);
    },
    on_tree_show_click: function (el) {
        el.style.display = 'none';
        var m = document.getElementById('ui-category');
        if (m != null) {
            m.style.display = '';
            module_broadcast({ action: 'tree_show' });
            localStorage['tree_display'] = 'block';
        }
    },
    on_tab_show_hide_click: function (el) {
        var m = document.getElementById('ui-tabs');
        if (m != null) {
            if (m.style.display == 'none') {
                m.style.display = 'block';
                //module_broadcast({ action: 'tabs_show' });
                localStorage['tabs_display'] = 'block';
            } else {
                m.style.display = 'none';
                //module_broadcast({ action: 'tabs_hide' });
                localStorage['tabs_display'] = 'none';
            }
        }
    },
};