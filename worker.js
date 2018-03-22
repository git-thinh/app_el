﻿var _cacheSendUI = new Array;
var _cacheSendAPI = new Array;
var _cacheSendAPI = new Array;
var _opend = false;
var _socket = null;

var window = self;

/* SPEECH */
 
self.addEventListener('message', function (e) {
    var data = e.data;
    console.log(e);

    //_cacheSendAPI.push(data);
}, false);

/* TIMER */

setInterval(function () {
    if (_cacheSendUI.length > 0) {
        var data = _cacheSendUI[0];
        _cacheSendUI.splice(0, 1);
        self.postMessage(data);
    }
}, 1000);

setInterval(function () {
    if (_opend && _cacheSendAPI.length > 0) {
        var data = _cacheSendAPI[0];
        _cacheSendAPI.splice(0, 1);
        _socket.send(data);
    }
}, 1000);

/* SOCKET */
function _socket_Init() {
    _socket = new WebSocket('ws://localhost:8889');
    _socket.onmessage = function (e) {
        _cacheSendUI.push(JSON.parse(e.data));
    };
    _socket.onopen = function () {
        _opend = true;
        self.postMessage({ action: 'API_OPEN' });
    };
    _socket.onclose = function () {
        _opend = false;
        self.postMessage({ action: 'API_CLOSE' });
    }
}
_socket_Init();
setInterval(function () {
    if (!_opend) {
        console.log('REOPEN SOCKET .....', new Date().toString());
        _socket_Init();
    }
}, 5000);
