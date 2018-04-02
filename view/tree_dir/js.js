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
                page_show();
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    on_root_click: function (el) {
        var pa = document.getElementById('');
        pa = el.parentElement;
        if (pa != null) {
            if (!pa.hasAttribute('open')) {
                alert('open dirs');

            }
        }
    },
};