var t = '¦', atag = [];
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
Array.from(document.querySelectorAll('a.topic-tag')).forEach(function (e1) { var s1 = e1.innerText.trim(); if (atag.indexOf(s1) == -1) atag.push(s1); });
t += atag.join(';');

var s = '';
Array.from(document.querySelectorAll('article.entry-content *')).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (s1 == undefined) return;
    s1 = s1.trim();
    if (s1.length == 0) return;
    switch (e1.tagName) {
        case 'H1':
            s += s1 + t;
            break;
        case 'H2': case 'H3': case 'H4': case 'H5': case 'H6':
            s += '\r\n■ ' + s1;
            break;
        case 'PRE':
            s += '\r\n^\r\n' + e1.innerText + '\r\nⱽ';
            break;
        case 'UL': case 'OL':
            s += '\r\n⌐';
            Array.from(e1.querySelectorAll('li')).forEach(function (e2, i2) {
                var s2 = e2.innerText;
                if (s2 == undefined) return;
                s2 = s2.trim();
                if (s2.length == 0) return;
                s += '\r\n• ' + s2;
            });
            s += '\r\n┘';
            break;
        case 'TABLE':
            s += '\r\n⌐';
            Array.from(e1.querySelectorAll('tr')).forEach(function (e2, i2) {
                if (i2 == 0) return;
                Array.from(e2.querySelectorAll('td')).forEach(function (e3, i3) {
                    var s3 = e3.innerText;
                    if (s3 == undefined) return;
                    s3 = s3.trim();
                    if (s3.length == 0) return;
                    if (i3 == 0)
                        s += '\r\n• ' + s3;
                    else
                        s += '\r\n' + s3;
                });
            });
            s += '\r\n┘';
            break;
        case 'DIV': case 'P':
            s += '\r\n' + s1;
            break;
        case 'SPAN':
            s += ' ' + s1;
            break;
        default:
            break;
    }
});
s;