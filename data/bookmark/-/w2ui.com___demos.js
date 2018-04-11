var s = document.getElementById('example_title').innerText;
var a = s.split('\n');
var key = 'W2UI.' + location.hash.substr(2).split('/')[0].toLowerCase() + ': ' + a[0].trim();
s = '\r\n\r\n■ ' + key + '\r\n' + s.substring(a[0].length, s.length);
localStorage[key] = s;

var s = '';
for (x in localStorage) s += localStorage[x];
s;