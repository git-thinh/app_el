var ___module_id = {
    m_path_root: '',
    m_path: '',
    m_item_current: null,
    m_query_current: null,
    m_items: [{
        description: '',
        devtoolsFrontendUrl: '',
        faviconUrl: '',
        id: '',
        title: '',
        type: '',
        url: '',
        webSocketDebuggerUrl: '',
    }],
    m_inited: false,
    /* MODULE */
    m_module_id: null,
    init: function (module) {
        this.m_module_id = module.id;
        var s = load(api_host + '/fetch?url=' + btoa('http://localhost:9222/json'));
        if (s != null && s.length > 0) {
            var a = JSON.parse(s);
            this.m_items = _.filter(a, function (it) { return it.url != null && it.url.indexOf('http') == 0; });
        }
        this.f_module_Init(module);
    },
    controller: function (module) {
        var state = module.state,
            id = module.id,
            data = module.data;
        var el = document.getElementById(id);
        if (el == null) return;

        switch (state) {
            case 'load':
                this.f_module_Open(module);
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
    /* MODULE */
    m_name_layout: null,
    m_name_toolbar: null,
    m_name_sidebar: null,
    m_name_grid: null,
    f_module_Init: function (module) {
        this.m_name_layout = module.id + '-layout';
        this.m_name_sidebar = module.id + '-sidebar';
        this.m_name_toolbar = module.id + '-toolbar';
        this.m_name_grid = module.id + '-grid';

        var name_layout = this.m_name_layout;
        var name_sidebar = this.m_name_sidebar;
        var name_toolbar = this.m_name_toolbar;
        var name_grid = this.m_name_grid;

        // initialization in memory

        $().w2layout({
            name: name_layout,
            padding: 0,
            panels: [
                {
                    type: 'top', size: 32, overflow: 'hidden',
                    style: 'background-color: #eee !important;border:none;'
                },
                {
                    type: 'left', size: '350px', resizable: true, minSize: 120, 
                    style: 'background-color: #eee !important;'
                },
                {
                    type: 'main', minSize: 350, overflow: 'hidden',
                    style: 'border: none;',
                    content: '',
                    tabs: {
                        active: 'tab_article',
                        tabs: [
                            { id: 'tab_article', text: 'Article' },
                            { id: 'tab_source', text: 'Source' },
                            { id: 'tab_text', text: 'Text' },
                        ],
                        onClick: function (event) {
                            //w2ui.layout.html('main', 'Active tab: ' + event.target);
                            switch (event.target) {
                                case 'tab_article':
                                    w2ui[name_layout].content('main', '<div class="main_data article_html">' + ___module_id.m_item_current.html + '</div>');
                                    break;
                                case 'tab_source':
                                    w2ui[name_layout].content('main', '<div class="main_data article_html"><textarea class=html>' + ___module_id.m_item_current.html + '</textarea></div>');
                                    break;
                                case 'tab_text':
                                    w2ui[name_layout].content('main', '<div class="main_data article_html"><textarea class=text>' + ___module_id.m_item_current.text + '</textarea></div>');
                                    break;
                            }
                        },
                        onClose: function (event) {
                            //this.click('tab0');
                        }
                    },
                }
            ]
        });

        $().w2toolbar({
            name: name_toolbar,
            style: 'border:none;',
            items: [
                { type: 'html', html: '<div class=title>//Online</div>' },
                //{ type: 'html', html: '<button title="Create folder" type="button" onclick="___module_id.f_form_create_init()"><i class=i-add></i><b>Create dir</b></button>' },
                //{ type: 'html', html: '<button title="Edit folder" type="button" onclick="___module_id.f_form_edit_init()"><i class=i-edit></i><b>Edit dir</b></button>' },
                //{ type: 'html', html: '<button title="Delete folder" type="button" onclick="___module_id.f_form_delete_init()"><i class=i-remove></i><b>Delete dir</b></button>' },
                //{ type: 'break' },
                { type: 'spacer' },
                { type: 'html', html: '<button title="Refresh" type="button" onclick="___module_id.f_form_create_init()"><i class="fa fa-sync"></i><b>Refresh</b></button>' },
                { type: 'html', html: '<button title="Save" type="button" onclick="___module_id.f_form_create_init()"><i class=i-save></i><b>Save</b></button>' },
                { type: 'html', html: '<button title="Close" type="button" onclick="___module_id.f_module_close()"><i class=i-close></i><b>Close</b></button>' },
            ],
            onClick: function (event) {
                console.log('Target: ' + event.target, event);
            }
        });

        var nodes = _.map(___module_id.m_items, function (it, index) { return { id: 'url-' + index, text: it.title, url: it.url, icon: 'far fa-star' }; });
        var sites = _.groupBy(nodes, function (it) { return it.url.split('/')[2]; });
        console.log(___module_id.m_items);
        console.log(nodes);
        console.log(sites);
        var ns = [], vals; a_simple = [];
        for (var key in sites) {
            vals = sites[key];
            if (vals.length > 1) {
                ns.push({ id: key, text: key, url: '', img: 'icon-folder', count: vals.length, nodes: vals });
            } else
                a_simple.push(vals[0]);
        }
        for (var i = 0; i < a_simple.length; i++) ns.push(a_simple[i]);

        $().w2sidebar({
            name: name_sidebar,
            style: '',
            nodes: { id: 'site', text: 'Site', group: true, expanded: true, nodes: ns },
            onClick: function (event) {
                var s = '';
                var url = event.node.url;
                console.log(url);

                s = load(api_host + '/crawler?url=' + btoa(url));
                if (s.length > 0) {
                    var json = JSON.parse(s);
                    ___module_id.m_item_current = json;
                    console.log(json);
                    w2ui[name_layout].content('main', '<div class="article_html">' + json.html + '</div>');
                } else {
                    w2ui[name_layout].content('main', '<div style="padding: 10px"> Can not find setting for: ' + url + '</div>');

                }

                //switch (event.target) {
                //    case 'grid':
                //        w2ui[name_layout].content('main', w2ui[name_grid]);
                //        break;
                //    case 'html':
                //        w2ui[name_layout].content('main', '<div style="padding: 10px">Some HTML</div>');
                //        $(w2ui[name_layout].el('main'))
                //            .removeClass('w2ui-grid')
                //        //.css({
                //        //    'border-left': '1px solid silver'
                //        //});
                //        break;
                //}
            }
        });

        $().w2grid({
            name: name_grid,
            style: '',
            columns: [
                { field: 'state', caption: 'State', size: '80px' },
                { field: 'title', caption: 'Title', size: '100%' },
                { field: 'priority', caption: 'Priority', size: '80px', attr: 'align="center"' }
            ],
            records: [
                { recid: 1, state: 'Open', title: 'Short title for the record', priority: 2 },
                { recid: 2, state: 'Open', title: 'Short title for the record', priority: 3 },
                { recid: 3, state: 'Closed', title: 'Short title for the record', priority: 1 }
            ]
        });
    },
    f_module_Open: function (module) {
        var name_layout = this.m_name_layout;
        var name_sidebar = this.m_name_sidebar;
        var name_toolbar = this.m_name_toolbar;
        var name_grid = this.m_name_grid;

        $('#' + this.m_module_id).w2render(name_layout);
        w2ui[name_layout].content('top', w2ui[name_toolbar]);
        w2ui[name_layout].content('left', w2ui[name_sidebar]);
        //w2ui[name_layout].content('main', w2ui[name_grid]);
        w2ui[name_layout].content('main', '<div class="main_data"></div>');
    }
};