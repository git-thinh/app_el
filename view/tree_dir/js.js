var ___module_id = {
    init: function (module) { },
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
    page_ready: function () {
        page_show();
        indicator_hide();
    },
    on_root_click: function (el) {
        var pa = document.getElementById('');
        pa = el.parentElement;
        if (pa != null) {
            if (!pa.hasAttribute('open')) {
                indicator_show();
                post_api({ action: 'dir_get', selector: el.id, callback: '___module_id.rs_draw_node', input: { path: '', folder: '' } })
            }
        }
    },
    on_node_click: function (el, dir) {
        var pa = document.getElementById('');
        pa = el.parentElement;
        if (pa != null) {
            if (!pa.hasAttribute('open')) {
                indicator_show();
                var path = '';
                if (el.hasAttribute('for')) path = el.getAttribute('for');
                var elID = el.id;
                if (elID == null || elID == '') {
                    elID = 'ID' + new Date().getTime();
                    el.setAttribute('id', elID);
                }
                post_api({ action: 'dir_get', selector: elID, callback: '___module_id.rs_draw_node', input: { path: path, folder: dir } })
            }
        }
    },
    rs_draw_node: function (m) {
        console.log(m);
        var el = document.getElementById(m.selector);
        if (el != null) {
            if (m == null || m.result == null || m.input == null) return;
            if (m.result.ok == false) { alert(m.result.msg); return; }

            var rs = m.result, folder = m.input.folder,
                path = rs.path, title;
            if (folder == null || folder == '') folder = '___root';

            Array.from(el.parentElement.querySelectorAll('ul.' + folder)).forEach(function (it) { it.remove(); });

            var s = '<ul class="' + folder + '">';
            Array.from(rs.dirs).forEach(function (it) {
                if (it.sum_file > 0) {
                    s += '<li><details><summary onclick="___module_id.on_node_click(this,\'' + it.dir + '\')" for="' + path + '">' + it.dir + '(' + it.sum_file + ')</summary></li>';
                } else {
                    s += '<li class="dir-empty">' + it.dir + '</li>';
                }
            });
            Array.from(rs.files).forEach(function (it) {
                title = it.title;
                if (title == null || title == '') title = it.file;
                s += '<li class="file" onclick="___module_id.on_file_click(this,\'' + it.file + '\')" for="' + path + '">' + title + '</li>';
            });
            s += '</ul>';

            var div = document.createElement('div');
            div.innerHTML = s;
            el.parentElement.appendChild(div);

            this.page_ready();
        }
    },
    on_file_click: function (el, file_name) {
        if (el.hasAttribute('for')) {
            indicator_show();
            var path = el.getAttribute('for');
            post_api({ action: 'file_load', callback: '___module_id.rs_file_view', input: { path: path, file_name: file_name } })
        }
    },
    rs_file_view: function (m) {
        console.log(m);
        if (m.result != null) {
            if (m.result.ok) {
                indicator_hide();
                module_broadcast(m);
            } else alert(m.result.msg);
        }
    },
};