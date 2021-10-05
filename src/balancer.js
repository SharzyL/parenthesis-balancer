const normalPairs = [
    '()', '[]', '{}', // English parenthesis, brackets, braces
    '（）', '⎜⎟', '⁽⁾', '₍₎', '⎛⎞', '⎝⎠', '⦅⦆', '⸨⸩', '❪❫', '⸨⸩', '﴾﴿', '﹛﹜', '﹝﹞', '｟｠', // alternative parenthesis
    '⟨⟩', '⦑⦒', '⁅⁆', '〈〉', '❬❭', '❲❳', '❴❵', '⟦⟧', '⟨⟩', '⟪⟫', '⟬⟭', '⦇⦈', '⦉⦊', '⦋⦌', '⦍⦎', '⦏⦐', '⦑⦒', '⦗⦘',
    '❮❯', '⠦⠴', // quotation marks that is easier to handle
    '《》', '〈〉', '「」', '｢｣', '【】', '〔〕', '［］', '『』', '〖〗', '｛｝', // brackets and braces in CJK
    '⏜⏝', '︵︶', '﹃﹄', '﹁﹂', '︗︘', '︵︶', '︷︸', '︹︺', '︻︼', '︽︾', '︿﹀', '﹁﹂', '﹇﹈', // vertical symbols
    '❴❵', '❬❭', '❨❩', '❪❫', '❲❳', '❮❯', // ornament symbols
]

const reversiblePairs = [
    '«»', '‹›', '༺༻', '༼༽', '᚜᚛',
]

export class PairCannotMatchError extends Error {}

export function balanceParenthesis(text) {
    const pairingMap = new Map() // map the opening element to the closing element
    const reversePairingMap = new Map()
    for (const pair of normalPairs) {
        pairingMap.set(pair[0], pair[1])
        reversePairingMap.set(pair[1], pair[0])
    }

    const reversiblePairsCounter = new Map()
    const reversiblePairsClassifier = new Map()
    for (const pair of reversiblePairs) {
        reversiblePairsClassifier.set(pair[1], pair[0])
        reversiblePairsClassifier.set(pair[0], pair[0])
        reversiblePairsCounter.set(pair[0], 0)
    }

    const stack = []
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i]
        if (pairingMap.get(char) !== undefined) {
            stack.push(char)
        }
        if (reversePairingMap.get(char) !== undefined) {
            for (const [, v] of reversiblePairsCounter) {
                if (v !== 0) {
                    throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
                }
            }
            if (stack.pop() !== reversePairingMap.get(char)) {
                throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
            }
        }
        if (reversiblePairsClassifier.get(char) !== undefined) {
            const charClass = reversiblePairsClassifier.get(char)
            const cnt = reversiblePairsCounter.get(charClass)
            if (char === charClass) {
                reversiblePairsCounter.set(charClass, cnt + 1)
            } else {
                reversiblePairsCounter.set(charClass, cnt - 1)
            }
        }
    }

    const returnChars = []

    for (const pair of reversiblePairs) {
        const cnt = reversiblePairsCounter.get(pair[0])
        if (cnt > 0) {
            for (let i = 0; i < cnt; i += 1) {
                returnChars.push(pair[1])
            }
        } else {
            for (let i = 0; i < -cnt; i += 1) {
                returnChars.push(pair[0])
            }
        }
    }

    for (let i = stack.length - 1; i >= 0; i -= 1) {
        const char = stack[i]
        if (pairingMap.get(char) !== undefined) {
            returnChars.push(pairingMap.get(char))
        } else {
            returnChars.push(reversiblePairsClassifier.get(char))
        }
    }

    return returnChars.join('')
}
