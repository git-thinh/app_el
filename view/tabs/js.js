var ___module_id = {
    init: function (module) { },
    message: function (m) {
        console.log('UI.MODULE.broadcast: ', m);
        if (m == null || m.action != 'file_load' || m.result == null || m.result.ok == false || m.result.text == null) return;
        var tab_word = document.getElementById('tab_word');
        if (tab_word != null) {
            var s = m.result.text;
            if (s == null || s.length == 0) {
            } else {
                s = s.convertToASCII();//.toLowerCase();
                var a = _.filter(s.split(' '), function (w) { return w.length > 2; });

                if (a.length > 0) {
                    var aw = _.groupBy(a);
                    a = _.map(aw, function (val, key) { return { w: key, k: val.length }; });
                    a = _.sortBy(a, function (o) { return o.k; })
                    a.reverse();

                    var s = '<table class="table-master-detail">';
                    a.forEach(function (it) {
                        s += '<tr id=' + it.w + '_w><td>&#9734</td><td class=w>' + it.w + '</td>' +
                            '<td id=' + it.w + '_m>&#9733</td>' +
                            '<td>' + it.k + '</td>' +
                            '<td class=wd onclick="___module_id.on_word_detail_click(this,\'' + it.w + '\')">+</td>' +
                            '</tr><tr class=detail><td colspan=5 id=' + it.w + '_wd></td></tr>';
                    });
                    s += '</table';
                }
                tab_word.innerHTML = s;
            }
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
                if (localStorage['tabs_display'] == null) localStorage['tabs_display'] = 'block';
                var tabs = document.getElementById('ui-tabs');
                if (tabs != null) tabs.style.display = localStorage['tabs_display'];

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
                var ul = '<ul id="">', s = '', se = '';
                Array.from(document.querySelectorAll('article i, article d')).forEach(function (it) {
                    s = it.innerText;
                    if (s != null) {
                        s = s.toLowerCase().trim();                        
                        if (s == word) {
                            se = it.parentElement.innerHTML.replace(/(<([^>]+)>)/ig, ' ');
                            se = se.split(word).join('<i class=sel>' + word + '</i>');
                            ul += '<li>' + se + '</li>';
                            it.className = 'sel';
                        } else it.className = '';
                    }
                });
                ul += '</ul>';
                el.innerHTML = ul;
                setTimeout(function () {
                    Array.from(document.querySelectorAll('#' + word + '_wd i, #' + word + '_wd d')).forEach(function (it) {
                        s = it.innerText;
                        if (s != null) {
                            s = s.toLowerCase().trim();
                            if (s == word) {
                                it.className = 'sel';
                            } else
                                it.className = '';
                        }
                    });
                }, 500);
            } else {
                el.parentElement.style = '';
                sel.innerHTML = '+';
            }
        }
    },
};