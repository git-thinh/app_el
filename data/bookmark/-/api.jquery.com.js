var key = '', tag = [];
Array.from(document.querySelectorAll('span.category a')).forEach(function (e1, i1) { if (e1.innerText && tag.indexOf(e1.innerText.trim()) == -1) tag.push(e1.innerText.trim()); });
if (tag.length > 0) key = '¦' + tag.join(',');

var s = '';
Array.from(document.querySelectorAll('h1.entry-title, .entry-content p.desc')).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (s1 == undefined) return; else s1 = s1.trim();
    if (s1.length == 0) return;
    if (e1.tagName == 'H1') s += s1 + key + '\r\n'; else s += s1 + '\r\n';
});
s += '\r\n⌐';
Array.from(document.querySelectorAll('.entry-content .entry-wrapper ul.signatures li')).forEach(function (e1, i1) {
    Array.from(e1.querySelectorAll('h4, p')).forEach(function (e2, i2) {
        var s2 = e2.innerText;
        if (s2 == undefined) return;
        s2 = s2.trim();
        if (s2.length == 0) return;
        if (e2.tagName == 'H4') {
            var a = s2.split('jQuery(');
            if (a.length > 1) s += '\r\n• ' + 'jQuery(' + a[1];
            s += '\r\n' + a[0];
        } else s += '\r\n' + s2;
    });
});
s += '\r\n┘\r\n\r\n';
Array.from(document.querySelectorAll('.entry-content .entry-wrapper div.longdesc,.entry-content .entry-wrapper h3')).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (s1 == undefined) return; else s1 = s1.trim();
    if (s1.length == 0) return;
    if (e1.tagName == 'H3') s += '\r\n■ ' + s1 + '\r\n'; else s += s1 + '\r\n';
});
s += '\r\n\r\n';
Array.from(document.querySelectorAll('section.entry-examples header, section.entry-examples p, section.entry-examples td.code')).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (s1 == undefined) return; else s1 = s1.trim();
    if (s1.length == 0) return;
    switch (e1.tagName) {
        case 'HEADER':
            s += '\r\n■ ' + s1 + '\r\n';
            break;
        case 'TD':
            s += '\r\n\r\n^\r\n' + s1 + '\r\nⱽ\r\n\r\n';
            break;
        default:
            s += s1 + '\r\n\r\n';
            break;
    }
});

s;