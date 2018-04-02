var ___module_id = {
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
                console.log('UI.MODULE.LOAD ' + module.code, module);
                el.style.display = '';
                break;
            default:
                console.log('UI.MODULE.' + state + ' - ' + module.code, module);
                break;
        }
    },
    username_change: function (event) {
        console.log('this is event_username_change ', event);
    },
};