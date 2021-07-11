import fs from 'fs'
import path from 'path'
import assert from 'assert'
import Cloudworker from '@dollarshaveclub/cloudworker'
import nock from 'nock'

import { API_URL, WEBHOOK_URL, TOKEN, } from '../constants.js'

const workerScript = fs.readFileSync(path.resolve('worker/script.js'), 'utf8')

describe('Test simple alert', async () => {
    let worker
    it('should load the script correctly', () => {
        worker = new Cloudworker(workerScript)
    })

    it('should refuse unauthorized access', async () => {
        const req = new Cloudworker.Request(`${WEBHOOK_URL}/hello`)
        const response = await worker.dispatch(req)
        assert.strictEqual(response.status, 401)
    })

    it('should send a bot message for correct request', async () => {
        const req = new Cloudworker.Request(`${WEBHOOK_URL}/${TOKEN}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "update_id": "666677728",
                "message": {
                    "message_id": 2136,
                    "from": {
                        "id": 629325599,
                        "is_bot": false,
                        "first_name": "Sharzy",
                        "username": "SharzyL",
                        "language_code": "en"
                    },
                    "chat": {
                        "id": -23412432413,
                        "title": "Test grp",
                        "type": "group",
                    },
                    "date": 1625928630,
                    "text": "你们不要总想着搞个大新闻（"
                }
            })
        })

        let botRequestSent = false
        nock(API_URL).post(() => true).reply(200, (uri, requestBody) => {
            botRequestSent = true
            assert.strictEqual(uri, `/bot${TOKEN}/sendMessage`, 'wrong uri')
            assert.deepStrictEqual(requestBody, {
                chat_id: -23412432413,
                text: '）',
                reply_to_message_id: 2136,
                parse_mode: 'HTML',
            }, 'wrong bot request')
            return { ok: true }
        })

        const response = await worker.dispatch(req)

        assert.strictEqual(response.status, 200)
        assert.ok(botRequestSent, 'bot request not sent')
    })
})
