import { handleRequest } from './handler.js'

addEventListener('fetch', (event) => {
    const { request } = event
    return event.respondWith(handleRequest(request))
})
