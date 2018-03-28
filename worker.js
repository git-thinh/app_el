importScripts('localforage.min.js');
importScripts('api.js');
self.onmessage = api.on_message;
api.f_init();