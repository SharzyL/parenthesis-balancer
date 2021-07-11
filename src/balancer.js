const normalPairs = [
    '()', '[]', '{}', // English parenthesis, brackets, braces
    '（）', '⎜⎟', '⁽⁾', '₍₎', '⎛⎞', '⎝⎠', '⦅⦆', '⸨⸩', '❪❫', '⸨⸩', '﴾﴿', '﹛﹜', '﹝﹞', '｟｠',  // alternative parenthesis
    '⟨⟩', '⦑⦒', '⁅⁆', '〈〉', '❬❭', '❲❳', '❴❵', '⟦⟧', '⟨⟩', '⟪⟫', '⟬⟭', '⦇⦈', '⦉⦊', '⦋⦌', '⦍⦎', '⦏⦐', '⦑⦒', '⦗⦘', 
    '❮❯',  '⠦⠴',  // quotation marks that is easier to handle
    '《》', '〈〉', '「」', '｢｣', '【】', '〔〕', '［］', '『』', '〖〗', '｛｝',   // brackets and braces in CJK
    '⏜⏝', '︵︶', '﹃﹄', '﹁﹂', '︗︘', '︵︶', '︷︸', '︹︺', '︻︼', '︽︾', '︿﹀', '﹁﹂', '﹇﹈',   // vertical symbols
    '❴❵', '❬❭', '❨❩', '❪❫', '❲❳', '❮❯',  // ornament symbols
]

const reversiblePairs = [
    '«»', '‹›', '༺༻', '༼༽', '᚜᚛', 
]

const chaoticPairs = [  // it is legal if for each class, there is even number of characters in the class
    '”„“', '’‚‘', '"', '\'', '🙷🙸🙶', '❜❟❛', '❞❠❝'
]

export class PairCannotMatchError extends Error {}

export function balanceParenthesis(text) {
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

    const returnChars = []

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