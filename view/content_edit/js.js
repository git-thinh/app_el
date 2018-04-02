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
        //setTimeout(function () {
            console.log('UI.MODULE.LOAD: ', module.code);
            el.style.display = '';
        //}, 3000);
        break;
    default:
        break;
}