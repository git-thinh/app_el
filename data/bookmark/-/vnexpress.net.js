var s = '';

Array.from(document.querySelectorAll('h1.title_news_detail')).forEach(function (it) { s += it.innerText; s += '¦[§]'; });
Array.from(document.querySelectorAll('h2.description')).forEach(function (it) { s += '¦■ ' + it.innerText; });
Array.from(document.querySelectorAll('section article.content_detail p')).forEach(function (it) {
    if (it.firstElementChild && it.firstElementChild.tagName == 'STRONG')
        s += '¦■ ' + it.innerText;
    else
        s += it.innerHTML;

    s += '¦';
});

s;