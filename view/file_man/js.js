var ___module_id = {
    m_path_root: '',
    m_path: '',
    m_item_current: null,
    m_query_current: null,
    m_items: [],
    m_inited: false,
    /* MODULE */
    m_module_id: null,
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
                ___module_id.f_grid_init(module);
                el.style.display = '';
                break;
            case this.m_form_edit_dir_id:
                this.f_form_edit_dir_submit(module);
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    f_module_close: function () {
        w2confirm('Are you sure close?')
            .yes(function () {
                module_close('___module_id');
            })
            .no(function () {
                console.log('NO');
            });
    },
    /* GRID */
    f_grid_draw: function (m) {
        //console.log(m);
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
    f_grid_post_api: function (m, path, folder) {
        if (path == null) path = '';
        if (folder == null) folder = '';

        indicator_show();

        var msg = { id: m.id, action: 'dir_get', callback: '___module_id.f_grid_draw', input: { path: path, folder: folder } };
        ___module_id.m_query_current = msg;
        post_api(msg);
    },
    f_grid_init: function (m) {
        ___module_id.m_module_id = m.id;

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
                toolbarReload: false,   // indicates if toolbar reload button is visible
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
            toolbar: {
                items: [
                    { type: 'html', html: '<button title="Create" type="button" onclick="___module_id.f_form_create_init()"><i class=i-add></i><b>Create</b></button>' },
                    { type: 'html', html: '<button title="Edit" type="button" onclick="___module_id.f_form_edit_init()"><i class=i-edit></i><b>Edit</b></button>' },
                    { type: 'html', html: '<button title="Delete" type="button" onclick="___module_id.f_form_delete_init()"><i class=i-remove></i><b>Delete</b></button>' },
                    { type: 'spacer' },
                    { type: 'html', html: '<button title="Close" type="button" onclick="___module_id.f_module_close()"><i class=i-close></i><b>Close</b></button>' },
                ]
            },
            records: [],
            onClick: function (event) {
                var md = ___module_id;
                var id = parseInt(event.recid);
                var its = _.filter(md.m_items, function (it) { return it.recid == id; });
                //console.log(its);
                if (its != null && its.length > 0) {
                    var it = its[0];
                    if (it.name != '...') {
                        md.m_item_current = it;
                    }
                }
            },
            onDblClick: function (event) {
                //console.log(event);
                var md = ___module_id;
                var id = parseInt(event.recid);
                var its = _.filter(md.m_items, function (it) { return it.recid == id; });
                //console.log(its);
                if (its != null && its.length > 0) {
                    var it = its[0];
                    if (it.name == '...') {
                        var a = md.m_path.split('/'),
                            fol = a[a.length - 1],
                            len = fol.length + 1,
                            pt = md.m_path.substring(0, md.m_path.length - len);
                        md.f_grid_post_api(m, pt, '');
                    } else {
                        md.m_item_current = it;
                        if (it.type == 'dir') {
                            var folder = it.name;
                            md.f_grid_post_api(m, md.m_path, folder);
                        }
                    }
                }
            }
        });

        w2ui[m.id].on('*', function (event) {
            if (event.type == 'resize' && ___module_id.m_inited == false) {
                ___module_id.m_inited = true;
                ___module_id.f_grid_post_api(m);
            }
        });

    },
    /* CREATE - EDIT - REMOVE */
    f_form_edit_callback: function (m) {
        console.log(m);
        if (m == null || m.result == null) return;
        var result = m.result;

        if (result.ok == false && result.msg != null) {
            w2alert(result.msg);
            return;
        }

        var md = ___module_id;
        md.m_item_current = null;

        if (result.ok == true && result.msg != null) {
            w2alert(result.msg).done(function () {
            });
            if (md.m_query_current) post_api(md.m_query_current);
        }
    },
    f_form_create_init: function () {
        var md = ___module_id;

        w2prompt({
            label: 'Enter folder name',               // label for the input control
            value: '',               // initial value of input
            attrs: 'size=35',               // attributes for input control
            title: 'Create new folder',   // title of dialog
            ok_text: 'Create',             // text of Ok button
            cancel_text: 'Cancel',         // text of Cancel button
            width: 400,              // width of the dialog
            height: 220,              // height of dialog
            callBack: null              // callBack function, if any
        })
            .change(function (event) {
                //console.log('Input value changed.', event);
                var el = event.target,
                    val = el.value;

                if (val.length == 0) {
                    el.className = 'w2ui-input w2ui-error';
                    document.querySelector('#w2ui-popup #Ok').setAttribute('disabled', 'disabled');
                    return;
                }

                if (val.match(/[^A-Za-z0-9 \-\_]/)) {
                    el.className = 'w2ui-input w2ui-error';
                    document.querySelector('#w2ui-popup #Ok').setAttribute('disabled', 'disabled');
                    if (document.getElementById('w2ui-message0') == null)
                        w2alert('Characters only: a-z,0-9,-, ,_');
                } else {
                    el.className = 'w2ui-input';
                    document.querySelector('#w2ui-popup #Ok').removeAttribute('disabled');
                }
            })
            .ok(function (val) {
                //alert(val);
                var msg = { action: 'dir_create', callback: '___module_id.f_form_edit_callback', input: { path: md.m_path, folder_new: val } };
                console.log(msg);
                post_api(msg);
            });
    },
    f_form_edit_init: function () {
        var md = ___module_id;
        //this.f_form_edit_dir_init();
        if (md.m_item_current == null) {
            w2alert('Please select folder to edit name!');
            return;
        }

        w2prompt({
            label: 'Enter folder name',               // label for the input control
            value: md.m_item_current.name,               // initial value of input
            attrs: 'size=35',               // attributes for input control
            title: 'Edit folder',   // title of dialog
            ok_text: 'Save',             // text of Ok button
            cancel_text: 'Cancel',         // text of Cancel button
            width: 400,              // width of the dialog
            height: 220,              // height of dialog
            callBack: null              // callBack function, if any
        })
            .change(function (event) {
                //console.log('Input value changed.', event);
                var el = event.target,
                    val = el.value;

                if (val.length == 0) {
                    el.className = 'w2ui-input w2ui-error';
                    document.querySelector('#w2ui-popup #Ok').setAttribute('disabled', 'disabled');
                    return;
                }

                if (val.match(/[^A-Za-z0-9 \-\_]/)) {
                    el.className = 'w2ui-input w2ui-error';
                    document.querySelector('#w2ui-popup #Ok').setAttribute('disabled', 'disabled');
                    if (document.getElementById('w2ui-message0') == null)
                        w2alert('Characters only: a-z,0-9,-, ,_');
                } else {
                    el.className = 'w2ui-input';
                    document.querySelector('#w2ui-popup #Ok').removeAttribute('disabled');
                }
            })
            .ok(function (val) {
                //alert(val);
                var msg = { action: 'dir_edit', callback: '___module_id.f_form_edit_callback', input: { path: md.m_path, folder: md.m_item_current.name, folder_new: val } };
                console.log(msg);
                post_api(msg);
            });
    },
    f_form_delete_init: function () {

        var md = ___module_id;
        //this.f_form_edit_dir_init();
        if (md.m_item_current == null) {
            w2alert('Please select folder to remove name!');
            return;
        }

        w2confirm({
            msg: 'Are you sure for remove folder [' + md.m_item_current.name + ']?',
            title: 'Delete',
            width: 450,     // width of the dialog
            height: 220,     // height of the dialog
            btn_yes: {
                text: 'Yes',   // text for yes button (or yes_text)
                class: '',      // class for yes button (or yes_class)
                style: '',      // style for yes button (or yes_style)
                callBack: null     // callBack for yes button (or yes_callBack)
            },
            btn_no: {
                text: 'No',    // text for no button (or no_text)
                class: '',      // class for no button (or no_class)
                style: '',      // style for no button (or no_style)
                callBack: null     // callBack for no button (or no_callBack)
            },
            callBack: null     // common callBack
        })
            .yes(function () {
                var msg = { action: 'dir_remove', callback: '___module_id.f_form_edit_callback', input: { path: md.m_path, folder: md.m_item_current.name } };
                console.log(msg);
                post_api(msg);
            })
            .no(function () {
                console.log("user clicked NO")
            });
    },
    /* FORM FOLDER EDIT */
    m_form_edit_dir_validate: '',
    m_form_edit_dir_id: 'ID' + new Date().getTime(),
    f_form_edit_dir_submit: function (m) {
        console.log('f_form_edit_dir_submit: ', m);

        var fom = w2ui[this.m_form_edit_dir_id];
        if (fom) {
            var it = m.input, fs = fom.fields, caption = '';
            if (it == null) {
                return;
            }

            if (it.name == '') {
                caption = fs[0].html.caption;
                w2alert(caption + ': must be not empty.');
                return;
            }

            if (this.m_form_edit_dir_validate != '') {
                caption = fs[0].html.caption;
                w2alert(caption + ': ' + this.m_form_edit_dir_validate);
                return;
            }

            w2popup.lock('Saving data', true);
            setTimeout(function () { w2popup.unlock(); }, 5000);
        }
    },
    f_form_edit_dir_input_name_change: function (el, val) {
        console.log(val);
        if (val.match(/[^A-Za-z0-9 \-\_]/)) {
            el.className = 'w2ui-input w2ui-error';
            this.m_form_edit_dir_validate = 'Characters only: a-z,0-9,-, ,_';
        } else {
            el.className = 'w2ui-input';
            this.m_form_edit_dir_validate = '';
        }
    },
    f_form_edit_dir_close: function () {
        w2popup.close();
    },
    f_form_edit_dir_init: function () {
        var form_id = this.m_form_edit_dir_id;

        if (!w2ui[form_id]) {
            var form_config = {
                name: form_id,
                fields: [
                    {
                        field: 'name', type: 'text', required: true,
                        html: {
                            caption: 'Folder name',
                            text: '<em>Character [a-z,0-9, ,-,_] </em>',
                            attr: 'onfocusout="___module_id.f_form_edit_dir_input_name_change(this,this.value)"',
                        }
                    },
                ],
                toolbar: {
                    items: [
                        { type: 'spacer' },
                        { type: 'html', html: '<button title="Save" type="submit"><i class=i-save></i><b>Save</b></button>' },
                        { type: 'html', html: '<button title="Close" type="button" onclick="___module_id.f_form_edit_dir_close()"><i class=i-close></i><b>Close</b></button>' },
                    ]
                },
                record: { name: 'english' },
            };

            $().w2form(form_config);
        }

        var hi = 150;
        if (device == 'mobi') hi = 300;
        $().w2popup('open', {
            title: 'Edit folder',
            body: '<form name="edit_dir" id="' + form_id + '" action="javascript:module_submit_form(\'___module_id\',\'' + form_id + '\');" style="width: 100%; height: 100%;"></form>',
            style: 'padding: 0px',
            //width: 500,
            height: hi,

            modal: true,
            showClose: false,
            showMax: false,

            onClose: function (event) { console.log('close'); },
            onMax: function (event) { console.log('max'); },
            onMin: function (event) { console.log('min'); },
            onKeydown: function (event) { console.log('keydown'); },

            onToggle: function (event) {
                $(w2ui[form_id].box).hide();
                event.onComplete = function () {
                    $(w2ui[form_id].box).show();
                    w2ui[form_id].resize();
                }
            },
            onOpen: function (event) {
                event.onComplete = function () {
                    // specifying an onOpen handler instead is equivalent to specifying an onBeforeOpen handler, which would make this code execute too early and hence not deliver.
                    $('#' + form_id).w2render(form_id);
                }
            }
        });
    },
};