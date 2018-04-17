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
Array.from(document.querySelectorAll('.entry-content .entry-wrapper ul.signatures li.signature')).forEach(function (e1, i1) {
    Array.from(e1.querySelectorAll(":scope > *")).forEach(function (e2, i2) {
        var s2 = e2.innerText;
        switch (e2.tagName) {
            case 'H4':
                var a = s2.split('.');
                if (a.length > 1) s += '\r\n• .' + a[a.length - 1] + ': ' + s2.substring(0, s2.length - (a[a.length - 1].length + 1));
                break;
            case 'UL':
                e2.querySelectorAll(":scope > *").forEach(function (e3, i3) {
                    if (e3.querySelectorAll(':scope > UL').length > 0) {
                        var w4 = '\r\n□ ';
                        e3.querySelectorAll(":scope > *").forEach(function (e4, i4) {
                            /* UL, DIV */
                            switch (e4.tagName) {
                                case 'UL':
                                    Array.from(e4.querySelectorAll(':scope > *')).forEach(function (e5, i5) {
                                        w4 += '\r\n▫ ' + e5.innerText + '\r\n\r\n';
                                    });
                                    break;
                                default:
                                    w4 += e4.innerText + '\r\n';
                                    break;
                            }
                        });
                        s += w4 + '\r\n\r\n';
                    } else {
                        /* DIV */
                        s += '\r\n□ ' + e3.innerText + '\r\n\r\n\r\n';
                    }
                });
                break;
        }
    });
});
s += '\r\n┘\r\n\r\n';
Array.from(document.querySelectorAll('.entry-content .entry-wrapper div.longdesc')[0].childNodes).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (s1 == undefined) return; else s1 = s1.trim();
    if (s1.length == 0) return;
    if (e1.tagName == 'P')
        s += s1 + '\r\n';
    else {
        Array.from(e1.querySelectorAll('code')).forEach(function (e2, i2) {
            s += '\r\n\r\n^\r\n' + e2.innerText + '\r\nⱽ\r\n\r\n';
        });
    }
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