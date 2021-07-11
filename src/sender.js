import { API_URL, TOKEN } from '../constants.js'

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
    return JSON.parse(text)
}