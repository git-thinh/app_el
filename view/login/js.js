function init(m) {
    console.log('this is init ' + m.code, m);
}

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