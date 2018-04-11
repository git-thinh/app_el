var s = '';
Array.from(document.querySelectorAll('h1.title_news_detail')).forEach(function (e1) { s += e1.innerText; s += '¦'; });
Array.from(document.querySelectorAll('h2.description')).forEach(function (e1) { s += '\r\n■ ' + e1.innerText; });

var a = Array.from(document.querySelectorAll('section article.content_detail p'));
a.forEach(function (e1, i1) {
    if (e1.firstElementChild && e1.firstElementChild.tagName == 'STRONG')
        s += '\r\n■ ' + e1.innerText;
    else
        s += '\r\n' + e1.innerText;
});

Array.from(document.querySelectorAll('section article.content_detail table tr')).forEach(function (e1, i1) {
    if (i1 == 0) return;
    Array.from(e1.querySelectorAll('td')).forEach(function (e2, i2) {
        if (i2 == 0)
            s += '\r\n■ ' + e2.innerText;
        else
            s += '\r\n' + e2.innerText;
    });
});

s;