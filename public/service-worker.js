const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/db.js"
];


const APP_PREFIX = 'Budget_Tracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {

            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches
            .keys()
            .then(function (keyList) {
                let cacheKeepList = keyList.filter(function (key) {
                    return key.indexOf(APP_PREFIX);
                });
                cacheKeepList.push(CACHE_NAME);

                return Promise.all(
                    keyList.map(function (key, i) {
                        if (cacheKeepList.indexOf(key) === -1) {

                            return caches.delete(keyList[i]);
                        }
                    })
                );
            })
    );
});


self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches
            .match(e.request)
            .then(function (request) {
                if (request) { 

                    return request
                } else {       

                    return fetch(e.request)
                }
            })
    )
})