var key = '';
Array.from(document.querySelectorAll('meta[name="keywords"]')).forEach(function (e1, i1) { if (e1.content) key = '¦' + e1.content.trim() + '\r\n'; });

var p = location.pathname;
if (p[p.length - 1] != '/') {
    var a = location.pathname.split('/');
    p = p.substring(0, p.length - a[a.length - 1].length);
} else p += '/';
var path_root = location.origin + p;


var s = '';
Array.from(document.querySelectorAll('#main div.col-sm-9.col-md-9.col-xs-9 *')).forEach(function (e1, i1) {
    var s1 = e1.innerText;
    if (e1.tagName != 'IMG' && s1 == undefined) return; else s1 = s1.trim();
    if (e1.tagName != 'IMG' && s1.length == 0) return;
    if (s1 == 'Please enable JavaScript to view the comments powered by Disqus.' || s1 == 'bogotobogo.com site search:') return;
    switch (e1.tagName) {
        case 'H1':
            break;
        case 'H2':
            s += s1;
            if (e1.className == 'section-title') s += key;
            break;
        case 'H3': case 'H4': case 'H5': case 'H6':
            s += '\r\n■ ' + s1;
            break;
        case 'PRE':
            s += '\r\n^\r\n' + e1.innerText + '\r\nⱽ';
            break;
        case 'UL': case 'OL':
            s += '\r\n⌐';
            e1.id = 'ID' + i1;
            Array.from(e1.querySelectorAll('#' + e1.id + ' > li')).forEach(function (e2, i2) {
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
            if (e1.className == 'subtitle' || e1.className == 'subtitle_2nd')
                s += '\r\n■ ' + s1;
            else
                s += '\r\n' + s1;
            break;
        case 'SPAN':
            s += ' ' + s1;
            break;
        case 'IMG': 
            if (e1.hasAttribute('src')) {
                var src = e1.getAttribute('src');
                if (src.indexOf('images/') == 0) 
                    s += '\r\n¦' + path_root + src;
            }
            break;
        default: 
            break;
    }
});
s;