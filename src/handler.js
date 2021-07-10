const { TOKEN } = require('../constants')
const { botRequest } = require('./sender')
const { WorkerError, escapeHtml } = require('./util')

normalPairs = [
    '()', '[]', '{}', // English parenthesis, brackets, braces
    '（）', '⎜⎟', '⁽⁾', '₍₎', '⎛⎞', '⎝⎠', '⦅⦆', '⸨⸩', '❪❫', '⸨⸩', '﴾﴿', '﹛﹜', '﹝﹞', '｟｠',  // alternative parenthesis
    '⟨⟩', '⦑⦒', '⁅⁆', '〈〉', '❬❭', '❲❳', '❴❵', '⟦⟧', '⟨⟩', '⟪⟫', '⟬⟭', '⦇⦈', '⦉⦊', '⦋⦌', '⦍⦎', '⦏⦐', '⦑⦒', '⦗⦘', 
    '❮❯',  '⠦⠴',  // quotation marks that is easier to handle
    '《》', '〈〉', '「」', '｢｣', '【】', '〔〕', '［］', '『』', '〖〗', '｛｝',   // brackets and braces in CJK
    '⏜⏝', '︵︶', '﹃﹄', '﹁﹂', '︗︘', '︵︶', '︷︸', '︹︺', '︻︼', '︽︾', '︿﹀', '﹁﹂', '﹇﹈',   // vertical symbols
    '❴❵', '❬❭', '❨❩', '❪❫', '❲❳', '❮❯',  // ornament symbols
]

reversiblePairs = [
    '«»', '‹›', '༺༻', '༼༽', '᚜᚛', 
]

chaoticPairs = [  // it is legal if for each class, there is even number of characters in the class
    '”„“', '’‚‘', '"', '\'', '🙷🙸🙶', '❜❟❛', '❞❠❝'
]

async function handlePut(request) {
    // auth
    const url = new URL(request.url)
    if (url.pathname != '/' + TOKEN) {
        throw new WorkerError(401, 'Unauthorized')
    }

    let reqText = await request.text()
    reqBody = JSON.parse(reqText)

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

async function debug(info) {
    let payload = 'debug: ' + info.toString()
    await botRequest('sendMessage', {
        chat_id: 629325599,
        text: `<pre>${payload}</pre>`,
        parse_mode: 'HTML',
    })
}

async function handleRequest(request) {
    try {
        return await handlePut(request)
    } catch (e) {
        if (e instanceof WorkerError) {
            return new Response(e.message, { status: e.statusCode })
        }

        const stack = e.stack || e
        let stackInfo = stack + ''
        await debug(stackInfo)

        return new Response(stackInfo, { status: 500 })
    }
}

class PairCannotMatchError extends Error {}

function balanceParenthesis(text) {
    const pairingMap = new Map()  // map the opening element to the closing element
    const reversePairingMap = new Map()
    for (let pair of normalPairs) {
        pairingMap.set(pair[0], pair[1])
        reversePairingMap.set(pair[1], pair[0])
    }

    const reversiblePairsCounter = new Map()
    const reversiblePairsClassifier = new Map()
    for (let pair of reversiblePairs) {
        reversiblePairsClassifier.set(pair[1], pair[0])
        reversiblePairsClassifier.set(pair[0], pair[0])
        reversiblePairsCounter.set(pair[0], 0)
    }

    const chaoticPairsCounter = new Map()
    const chaoticPairsClassifier = new Map()
    for (let pair of chaoticPairs) {
        for (let char of pair) {
            chaoticPairsClassifier.set(char, pair[0])
        }
        chaoticPairsCounter.set(pair[0], 0)
    }

    const stack = []
    for (let i = 0; i < text.length; i++) {
        let char = text[i]
        if (pairingMap.get(char) != undefined) {
            stack.push(char)   
        }
        if (reversePairingMap.get(char) != undefined) {
            for (let [k, v] of reversiblePairsCounter) {
                if (v != 0) {
                    throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
                }
            }
            for (let [k, v] of chaoticPairsCounter) {
                if (v % 2 != 0) {
                    throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
                } else {
                    chaoticPairsCounter.set(k, 0)
                }
            }
            if (stack.pop() != reversePairingMap.get(char)) {
                throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
            }
        }
        if (reversiblePairsClassifier.get(char) != undefined) {
            const charClass = reversiblePairsClassifier.get(char)
            const cnt = reversiblePairsCounter.get(charClass)
            if (char === charClass) {
                reversiblePairsCounter.set(charClass, cnt + 1)
            } else {
                reversiblePairsCounter.set(charClass, cnt - 1)
            }
        }
        if (chaoticPairsClassifier.get(char) != undefined) {
            if (char === '\'' && text[i + 1] !== ' ' && text[i - 1] !== ' ') continue  // ignore apostrophe surrounds by non-spaces
            const charClass = chaoticPairsClassifier.get(char)
            const cnt = chaoticPairsCounter.get(charClass)
            chaoticPairsCounter.set(charClass, cnt + 1)
        }
    }

    returnChars = []

    for (let pair of reversiblePairs) {
        const cnt = reversiblePairsCounter.get(pair[0])
        if (cnt > 0) {
            for (let i = 0; i < cnt; i++) {
                returnChars.push(pair[1])
            }
        } else {
            for (let i = 0; i < -cnt; i++) {
                returnChars.push(pair[0])
            }
        }
    }

    for (let pair of chaoticPairs) {
        const cnt = chaoticPairsCounter.get(pair[0])
        if (cnt % 2 != 0) {
            returnChars.push(pair[0])
        }
    }

    for (let i = stack.length - 1; i >= 0; i--) {
        const char = stack[i]
        if (pairingMap.get(char) != undefined) {
            returnChars.push(pairingMap.get(char))
        } else if (reversiblePairsClassifier.get(char) == undefined) {
            returnChars.push(reversiblePairsClassifier.get(char))
        } else {
            returnChars.push(chaoticPairsClassifier.get(char))
        }
    }

    return returnChars.join('')
}

module.exports = {
    handleRequest,
    balanceParenthesis,
    PairCannotMatchError
}
