var ___module_id = {
    m_folder_prev: '',
    m_folder_current: '',
    m_path_root: '',
    m_path: '',
    m_item_current: null,
    m_items: [],
    m_inited: false,
    init: function (module) {
        console.log('this is init ' + module.code, module);
    },
    controller: function (module) {
        var state = module.state,
            id = module.id,
            data = module.data;
        var el = document.getElementById(id);
        if (el == null) return;

        switch (state) {
            case 'load':
                //console.log('UI.MODULE.LOAD ' + module.code, module);
                ___module_id.f_draw_grid(module);
                el.style.display = '';
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    f_bind_data_grid: function (m) {
        console.log(m);
        if (m == null || m.result == null) return;

        //var url = api_host + '?type=dir_get&path=' + path + '&folder=' + folder;
        //console.log(url);
        //var result = JSON.parse(load(url));
        var result = m.result;
        if (result.msg != null || result.ok != true) {
            alert(result.msg);
            return;
        }

        var _path = result.path;
        if (_path[_path.length - 1] == '/') _path = _path.substring(0, _path.length - 1);

        ___module_id.m_path = _path;
        if (___module_id.m_path_root == '') ___module_id.m_path_root = _path;

        var dt = [];
        if (___module_id.m_path != ___module_id.m_path_root) {
            /* is fetch subs folder */
            dt.push({ recid: 0, type: 'dir', name: '...', title: '', count: '', date: '' });
        }

        var _count = result.dirs.length;
        Array.from(result.dirs).forEach(function (it, index) {
            dt.push({ recid: index + 1, type: 'dir', name: it.dir, title: '', count: it.sum_file, date: '' });
        });
        Array.from(result.files).forEach(function (it, index) {
            dt.push({ recid: _count + index + 1, type: 'file', name: it.file, title: it.title, count: it.sum_file, date: '' });
        });

        ___module_id.m_items = dt;

        //console.log(___module_id);

        w2ui[m.id].header = _path;
        w2ui[m.id].records = ___module_id.m_items;
        w2ui[m.id].refresh();

        indicator_hide();
    },
    f_load_dir: function (m, path, folder) {
        if (path == null) path = '';
        if (folder == null) folder = '';

        indicator_show();

        post_api({ id: m.id, action: 'dir_get', callback: '___module_id.f_bind_data_grid', input: { path: path, folder: folder } });
    },
    f_draw_grid: function (m) {

        $('#' + m.id).w2grid({
            name: m.id,
            show: {
                header: true,  // indicates if header is visible
                toolbar: true,  // indicates if toolbar is visible
                footer: true,  // indicates if footer is visible
                columnHeaders: true,   // indicates if columns is visible
                lineNumbers: false,  // indicates if line numbers column is visible
                expandColumn: false,  // indicates if expand column is visible
                selectColumn: false,  // indicates if select column is visible
                emptyRecords: true,   // indicates if empty records are visible
                toolbarReload: true,   // indicates if toolbar reload button is visible
                toolbarColumns: false,   // indicates if toolbar columns button is visible
                toolbarSearch: true,   // indicates if toolbar search controls are visible

                toolbarAdd: false,   // indicates if toolbar add new button is visible
                toolbarEdit: false,   // indicates if toolbar edit button is visible
                toolbarDelete: false,   // indicates if toolbar delete button is visible
                toolbarSave: false,   // indicates if toolbar save button is visible

                selectionBorder: true,   // display border around selection (for selectType = 'cell')
                recordTitles: true,   // indicates if to define titles for records
                skipRecords: true    // indicates if skip records should be visible
            },
            multiSearch: false,
            reorderRows: true,
            searches: [
                { field: 'name', caption: 'Name', type: 'text' },
                { field: 'title', caption: 'Title', type: 'text' }
            ],
            columns: [
                { field: 'recid', caption: 'ID', size: '50px', sortable: true, attr: 'align=center' },
                { field: 'type', caption: 'Type', size: '1%', sortable: true, resizable: true, hidden: true },
                {
                    field: 'name', caption: 'Name', sortable: true, resizable: true, attr: "for=dir_file",
                    render: function (record, index, column_index) {
                        return '<div class=i-' + record.type + '>' + record.name + '</div>';
                    }
                },
                { field: 'title', caption: 'Title', size: '45%', sortable: true, resizable: true },
                { field: 'count', caption: 'Count', size: '50px' },
                { field: 'date', caption: 'Date', size: '60px' }
            ],
            onAdd: function (event) {
                w2alert('add');
            },
            onEdit: function (event) {
                w2alert('edit');
            },
            onDelete: function (event) {
                console.log('delete has default behavior');
            },
            onSave: function (event) {
                w2alert('save');
            },
            toolbar: {
                items: [
                    { id: 'bt1', type: 'button', caption: 'Button 1', img: 'icon-folder' },
                    { id: 'bt3', type: 'spacer' },
                    { id: 'bt4', type: 'button', caption: 'Reset', img: 'icon-page' },
                    { id: 'bt5', type: 'button', caption: 'Save', img: 'icon-page' }
                ],
                onClick: function (event) {
                    if (event.target == 'bt4') w2ui.form.clear();
                    if (event.target == 'bt5') w2ui.form.save();
                }
            },
            records: [], //___module_id.m_items,
            onDblClick: function (event) {
                //console.log(event);
                var id = parseInt(event.recid);
                var its = _.filter(___module_id.m_items, function (it) { return it.recid == id; });
                //console.log(its);
                if (its != null && its.length > 0) {
                    var it = its[0];
                    if (it.name == '...') {
                        var a = ___module_id.m_path.split('/'),
                            fol = a[a.length - 1],
                            len = fol.length + 1,
                            pt = ___module_id.m_path.substring(0, ___module_id.m_path.length - len);
                        ___module_id.f_load_dir(m, pt, '');
                    } else {
                        ___module_id.m_item_current = it;
                        if (it.type == 'dir') {
                            var folder = it.name;
                            ___module_id.f_load_dir(m, ___module_id.m_path, folder);
                        }
                    }
                }
            }
        });

        w2ui[m.id].on('*', function (event) {
            if (event.type == 'resize' && ___module_id.m_inited == false) {
                ___module_id.m_inited = true;
                ___module_id.f_load_dir(m);
            }
        });
    }
};