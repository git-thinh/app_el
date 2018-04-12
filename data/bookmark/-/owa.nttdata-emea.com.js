var t = '', atag = [];
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
Array.from(document.querySelectorAll('a.post-tag')).forEach(function (e1) { var s1 = e1.innerText.trim(); if (atag.indexOf(s1) == -1) atag.push(s1); });
if (atag.length > 0) t = '¦' + atag.join(';');

var s = '';
Array.from(document.querySelectorAll('div[id="Item.MessagePartBody"]')).forEach(function (e1) { s += e1.innerText.trim() + '\r\n'; });
s;