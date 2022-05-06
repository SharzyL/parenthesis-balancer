import { API_URL, TOKEN } from '../constants.js'
import { WorkerError } from './util.js'

export async function botRequest(method, params) {
    const url = `${API_URL}/bot${TOKEN}/${method}`
    const init = {
        body: JSON.stringify(params),
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    }
    const response = await fetch(url, init)
    const text = await response.text()
    const result = JSON.parse(text)
    if ('ok' in result && !result.ok) {
        throw WorkerError(500, text)
    }
    return result
}
