const normalPairs = [
    '()', '[]', '{}', // English parenthesis, brackets, braces
    '（）', '⎜⎟', '⁽⁾', '₍₎', '⎛⎞', '⎝⎠', '⦅⦆', '⸨⸩', '❪❫', '⸨⸩', '﴾﴿', '﹛﹜', '﹝﹞', '｟｠', // alternative parenthesis
    '⟨⟩', '⦑⦒', '⁅⁆', '〈〉', '❬❭', '❲❳', '❴❵', '⟦⟧', '⟨⟩', '⟪⟫', '⟬⟭', '⦇⦈', '⦉⦊', '⦋⦌', '⦍⦎', '⦏⦐', '⦑⦒', '⦗⦘',
    '❮❯', '⠦⠴', // quotation marks that is easier to handle
    '《》', '〈〉', '「」', '｢｣', '【】', '〔〕', '［］', '『』', '〖〗', '｛｝', // brackets and braces in CJK
    '⏜⏝', '︵︶', '﹃﹄', '﹁﹂', '︗︘', '︵︶', '︷︸', '︹︺', '︻︼', '︽︾', '︿﹀', '﹁﹂', '﹇﹈', // vertical symbols
    '❴❵', '❬❭', '❨❩', '❪❫', '❲❳', '❮❯', // ornament symbols
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

    const stack = []
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i]
        if (pairingMap.get(char) !== undefined) {
            stack.push(char)
        }
        if (reversePairingMap.get(char) !== undefined) {
            if (stack.pop() !== reversePairingMap.get(char)) {
                throw new PairCannotMatchError('WORLD IN CRISIS! I cannot balance your symbols!')
            }
        }
    }

    const returnChars = []

    for (let i = stack.length - 1; i >= 0; i -= 1) {
        const char = stack[i]
        returnChars.push(pairingMap.get(char))
    }

    return returnChars.join('')
}
