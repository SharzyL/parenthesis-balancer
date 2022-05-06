import { TOKEN } from '../constants.js'
import { botRequest } from './sender.js'
import { WorkerError, escapeHtml } from './util.js'
import { balanceParenthesis, PairCannotMatchError } from './balancer.js'
import { cannotBalance, balancePusheen } from './pusheen.js'

async function handlePut(request) {
    // auth
    const url = new URL(request.url)
    if (url.pathname !== `/${TOKEN}`) {
        throw new WorkerError(401, 'Unauthorized')
    }

    const reqText = await request.text()
    const reqBody = JSON.parse(reqText)

    if ('message' in reqBody && 'sticker' in reqBody.message) {
        const chatID = reqBody.message.chat.id
        const msgID = reqBody.message.message_id
        const retStickerFileID = balancePusheen(reqBody.message.sticker)
        if (retStickerFileID) {
            await botRequest('sendSticker', {
                chat_id: chatID,
                reply_to_message_id: msgID,
                sticker: retStickerFileID,
                allow_sending_without_reply: true,
            })
        } else if (cannotBalance(reqBody.message.sticker)) {
            await botRequest('sendMessage', {
                chat_id: chatID,
                text: '🍓 IN CRISIS, CANNOT balance your Pusheen!',
                reply_to_message_id: msgID,
            })
        }
    } else if ('message' in reqBody && 'chat' in reqBody.message && 'text' in reqBody.message) {
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
    } else if ('inline_query' in reqBody && 'query' in reqBody.inline_query) {
        const queryID = reqBody.inline_query.id
        const queryText = reqBody.inline_query.query
        try {
            const balancedText = queryText + balanceParenthesis(queryText)
            await botRequest('answerInlineQuery', {
                inline_query_id: queryID,
                results: [
                    {
                        type: 'article',
                        id: Math.random(),
                        title: balancedText,
                        input_message_content: {
                            message_text: balancedText,
                        },
                    },
                ],
            })
        } catch (e) {
            if (e instanceof PairCannotMatchError) {
                await botRequest('answerInlineQuery', {
                    inline_query_id: queryID,
                    results: [
                        {
                            type: 'article',
                            id: Math.random(),
                            title: 'CANNOT balance your parenthesis',
                            input_message_content: {
                                message_text: 'CANNOT balance your parenthesis',
                            },
                        },
                    ],
                })
            }
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
