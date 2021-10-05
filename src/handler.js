import { TOKEN } from '../constants.js'
import { botRequest } from './sender.js'
import { WorkerError, escapeHtml } from './util.js'
import { balanceParenthesis, PairCannotMatchError } from './balancer.js'

async function handlePut(request) {
    // auth
    const url = new URL(request.url)
    if (url.pathname !== `/${TOKEN}`) {
        throw new WorkerError(401, 'Unauthorized')
    }

    const reqText = await request.text()
    const reqBody = JSON.parse(reqText)

    if ('message' in reqBody && 'chat' in reqBody.message && 'text' in reqBody.message) {
        const chatID = reqBody.message.chat.id
        const msgID = reqBody.message.message_id
        const msgText = reqBody.message.text
        let responseText = ''
        try {
            responseText = balanceParenthesis(msgText)
        } catch (e) {
            if (e instanceof PairCannotMatchError) {
                responseText = e.message
            } else {
                throw new Error(`Exception ${e} when handling message ${JSON.stringify(reqBody, null, 2)}`)
            }
        }
        if (responseText.length !== 0) {
            await botRequest('sendMessage', {
                chat_id: chatID,
                text: escapeHtml(responseText),
                reply_to_message_id: msgID,
                parse_mode: 'HTML',
            })
        }
    }

    return new Response('ok', { status: 200 })
}

export async function handleRequest(request) {
    try {
        return await handlePut(request)
    } catch (e) {
        if (e instanceof WorkerError) {
            return new Response(e.message, { status: e.statusCode })
        }

        const stackInfo = (e.stack || e).toString()
        console.log(stackInfo)

        return new Response(stackInfo, { status: 500 })
    }
}

