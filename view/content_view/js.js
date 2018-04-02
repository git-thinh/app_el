var ___module_id = {
    init: function (module) { },
    message: function (m) {
        console.log('UI.MODULE.broadcast: ', m);
        if (m == null || m.action != 'file_load' || m.result == null || m.result.ok == false || m.result.text == null) return;
        var el = document.getElementById('ui-article');
        if (el != null) {
            var htm = '<article>', s = m.result.text,
                a = s.split('\r\n'), si = '',
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
                            if (isCode)
                                htm += si + '\r\n';
                            else
                                htm += '<p>' + si + '</p>';
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