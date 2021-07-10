const handler = require('./handler')

addEventListener('fetch', (event) => {
    const { request } = event
    return event.respondWith(handler.handleRequest(request))
})
