var ___module_id = {
    m_node_selected: { type: 'dir', path: '', dir: '', file: '', title: '' },
    init: function (module) {
        /* load tree dirs */
        post_api({ action: 'dir_get', selector: 'tree_category', callback: '___module_id.rs_draw_node', input: { path: '', folder: '' } });
    },
    controller: function (module) {
        var state = module.state,
            id = module.id,
            data = module.data;
        var el = document.getElementById(id);
        if (el == null) return;

        switch (state) {
            case 'load':
                /* update state box panel tree lastest */
                if (localStorage['tree_display'] == null) localStorage['tree_display'] = 'block';
                var tree = document.getElementById('ui-category');
                if (tree != null) tree.style.display = localStorage['tree_display'];
                /* display module */
                el.style.display = '';
                /* click auto node root */
                //var tree_node_root = document.getElementById('tree_node_root');
                //if (tree_node_root) tree_node_root.click();
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    on_tree_hide_click: function (el) {
        var m = document.getElementById('ui-category');
        if (m != null) {
            m.style.display = 'none';
            module_broadcast({ action: 'tree_hide' });
            localStorage['tree_display'] = 'none';
        }
    },
    page_ready: function () {
        page_show();
        indicator_hide();
    },
    /* NODE */
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
    build_domID: function (text) {
        return this.convertToASCII(text)
            .split(' ').join('-')
            .split(':').join('')
            .split('/').join('_')
            .split('.').join('_')
            .split('\\').join('-');
    },
    convertToASCII: function (str) {
        if (str == null) return '';
        //var str;
        //if (eval(obj))
        //    str = eval(obj).value;
        //else
        //    str = obj;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");  
        /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
        //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-  
        str = str.replace(/^\-+|\-+$/g, "");
        //cắt bỏ ký tự - ở đầu và cuối chuỗi 
        //eval(obj).value = str.toUpperCase();
        return str;
    },
    rs_draw_node: function (m) {
        console.log(m);
        var el = document.getElementById(m.selector);
        if (el != null) {
            if (m == null || m.result == null || m.input == null) return;
            if (m.result.ok == false) { alert(m.result.msg); return; }

            var s = '', rs = m.result, isRoot = false,
                folder = m.input.folder,
                path = rs.path, title, cssRoot = '';
            if (folder == null || folder == '') isRoot = true;
            if (isRoot) {
                folder = '___root';
                cssRoot = 'class=___root';
            }

            /* dir sub */
            var folder_key = this.convertToASCII(folder).split(' ').join('-');
            Array.from(el.parentElement.querySelectorAll('ul.' + folder_key)).forEach(function (it) { it.remove(); });

            s = '<ul class="' + folder_key + '">';
            Array.from(rs.dirs).forEach(function (it) {
                if (it.sum_file > 0) {
                    s += '<li><details><summary ' + cssRoot + ' onclick="___module_id.on_node_click(this,\'' + it.dir + '\')" for="' + path + '">' + it.dir + '(' + it.sum_file + ')</summary></li>';
                } else {
                    s += '<li class="dir-empty">' + it.dir + '</li>';
                }
            });
            Array.from(rs.files).forEach(function (it) {
                title = it.title;
                if (title == null || title == '') title = it.file;
                s += '<li class="file" id="' + ___module_id.build_domID(path + it.file) + '" onclick="___module_id.on_file_click(this,\'' + it.file + '\')" for="' + path + '"><em></em><b>' + title.split('¦')[0] + '</b></li>';
            });
            s += '</ul>';

            if (isRoot) {
                el.innerHTML = s;
                /* auto click node root to open subs folder */
                setTimeout(function () {
                    var elroot = document.querySelector('summary.___root');
                    if (elroot) elroot.click();
                    ___module_id.page_ready();
                }, 100);
            } else {
                var div = document.createElement('div');
                div.innerHTML = s;
                el.parentElement.appendChild(div);
                this.page_ready();
            }
        }
    },
    /* FILE */
    on_file_click: function (el, file_name) {
        if (el.hasAttribute('for')) {
            indicator_show();
            var path = el.getAttribute('for');
            //el.id = 'ID' + new Date().getTime();
            //el.id = this.build_domID(path + file_name);
            var m = { action: 'file_load', selector: el.id, callback: '___module_id.rs_file_view', input: { path: path, file_name: file_name } };
            var m2 = _.clone(m);
            m2.callback = 'module_broadcast';
            localStorage['file_load'] = JSON.stringify(m2);
            post_api(m);
        }
    },
    rs_file_view: function (m) {
        console.log(m);
        if (m.result != null) {
            if (m.result.ok) {
                indicator_hide();
                module_broadcast(m);
                var el = document.getElementById(m.selector);
                if (el != null) {
                    Array.from(document.querySelectorAll('li.file')).forEach(function (it) { it.className = 'file'; });
                    el.className = 'file active';
                }
            } else alert(m.result.msg);
        }
    },
};