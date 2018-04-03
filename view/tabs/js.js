var ___module_id = {
    init: function (module) { },
    message: function (m) {
        console.log('UI.MODULE.broadcast: ', m);
        if (m == null || m.action != 'file_load' || m.result == null || m.result.ok == false || m.result.text == null) return;
        var tab_word = document.getElementById('tab_word');
        if (tab_word != null) {
            var htm = '<article>', s = m.result.text,
                a = s.split(' '), w = '', k = 0; 
            if (a.length > 0) {
                var aw = _.groupBy(a);

                var s = '<table class="table-master-detail">'
                for (var key in aw) {
                    w = key;
                    if (w.length > 3) {
                        k = aw[key].length;
                        s += '<tr id=' + w + '_w><td></td><td>' + w + '</td>' +
                            '<td id=' + w + '_m></td>' +
                            '<td>' + k + '</td>' +
                            '<td class=wd onclick="___module_id.on_word_detail_click(this,\'' + w + '\')">+</td>' +
                            '</tr><tr class=detail><td colspan=5 id=' + w + '_wd></td></tr>';
                    }
                }
                s += '</table';
            }
            tab_word.innerHTML = s;
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
    on_word_detail_click: function (sel, word) {  
        var el = document.getElementById(word + '_wd');
        if (sel != null && el != null) {
            if (el.parentElement.style.display != 'table-row') {
                el.parentElement.style.display = 'table-row';
                sel.innerHTML = '-';
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
                sel.innerHTML = '+';
            }
        } 
    },
};