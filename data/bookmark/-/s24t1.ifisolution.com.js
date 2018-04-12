var t = '', atag = [];
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
Array.from(document.querySelectorAll('a.post-tag')).forEach(function (e1) { var s1 = e1.innerText.trim(); if (atag.indexOf(s1) == -1) atag.push(s1); });
if (atag.length > 0) t = '¦' + atag.join(';');

var s = '';
Array.from(document.querySelectorAll('#content div.subject, #content div.description .wiki')).forEach(function (e1) { s += '\r\n' + e1.innerText.trim(); });
s += '\r\n⌐';
Array.from(document.querySelectorAll('#history div.wiki p')).forEach(function (e1) { s += '\r\n• ' + e1.innerText.trim(); });
s += '\r\n┘';
s;