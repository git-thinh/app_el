var ___module_id = {
    init: function (module) { },
    message: function (m) {
        console.log('UI.MODULE.broadcast: ', m);
        if (m == null || m.action != 'file_load' || m.result == null || m.result.ok == false || m.result.text == null) return;
        var el = document.getElementById('ui-article');
        if (el != null) {
            var htm = '<article>', s = m.result.text,
                a = _split(s, ['\r', '\n']), si = '', c0, lang = 'e',
                isList = false, isCode = false;
            for (var i = 0; i < a.length; i++) {
                si = a[i];
                if (i == 0) htm += '<h1>' + si + '</h1>'; else {
                    switch (si[0]) {
                        case '■': // h3
                            si = si.substring(1, si.length).trim();
                            htm += '<h3>' + si + '</h3>';
                            break;
                        case '⌐': // ul, ol
                            si = si.substring(1, si.length).trim();
                            isList = true;
                            htm += '<ul>';
                            break;
                        case '●': // li
                            si = si.substring(1, si.length).trim();
                            if (isList) {
                                htm += '<li>' + si + '</li>';
                            } else {
                                htm += '<p>' + si + '</p>';
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
                                            htm += '<p class="' + lang + ' b">' + si + '</p>';
                                        else
                                            htm += '<p class="' + lang + '">' + si + '</p>';
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            htm += '</article>';
            el.innerHTML = htm;
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
                el.style.display = '';
                var tree_node_root = document.getElementById('tree_node_root');
                if (tree_node_root) tree_node_root.click();
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
};