import { TOKEN } from '../constants.js'
import { botRequest } from './sender.js'
import { WorkerError, escapeHtml } from './util.js'
import { balanceParenthesis, PairCannotMatchError } from './balancer.js'

export async function handleRequest(request) {
    try {
        return await handlePut(request)
    } catch (e) {
        if (e instanceof WorkerError) {
            return new Response(e.message, { status: e.statusCode })
        }

        const stack = e.stack || e
        let stackInfo = stack + ''
        console.log(stackInfo)

        return new Response(stackInfo, { status: 500 })
    }
}

async function handlePut(request) {
    // auth
    const url = new URL(request.url)
    if (url.pathname != '/' + TOKEN) {
        throw new WorkerError(401, 'Unauthorized')
    }

    let reqText = await request.text()
    const reqBody = JSON.parse(reqText)

    if ('message' in reqBody && 'chat' in reqBody.message && 'text' in reqBody.message) {
        const chat_id = reqBody.message.chat.id
        const msg_id = reqBody.message.message_id
        const text = reqBody.message.text
        let responseText = ''
        try {
            responseText = balanceParenthesis(text)
        } catch (e) {
            if (e instanceof PairCannotMatchError) {
                responseText = e.message
            } else {
                throw new Error(`Exception ${e} when handling message ${JSON.stringify(reqBody, null, 2)}`)
            }
        }
        if (responseText.length != 0) {
            await botRequest('sendMessage', {
                chat_id,
                text: escapeHtml(responseText),
                reply_to_message_id: msg_id,
                parse_mode: 'HTML'
            })
        }
    }

    return new Response('ok', { status: 200 })
}
