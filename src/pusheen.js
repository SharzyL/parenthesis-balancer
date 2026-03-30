const pusheenCollapseTail = 'CAACAgUAAxUAAWJ0nUzdQBTWZ4iyMIKfE1X0Ej5UAAKABwACD3GhV71NHSno4gZeJAQ'
const pusheenCollapseTailSmile = 'CAACAgUAAxUAAWJ1BPTuPIpB0sWhUYhtdcxCd5DfAAI7BQACofypVydaepBBbVD9JAQ'
const pusheenStretchTail = 'CAACAgUAAxUAAWJ0nUz4mY2q2zR1cA1UoCiDds82AAJXBgACtzahVwh-zx9bs-H3JAQ'
const pusheenStretchTailSmall = 'CAACAgUAAxUAAWJ0p66fqz6uRleXSCx_71YAAVbr5wAC_gQAAhoqqVcFYK598VlajyQE'
const pusheenBadminton = 'CAACAgUAAxkBAAJZZGnKQWdcno5ppeY5SCWri-1i-WK9AAKUBQACRCUJVKlCWrmBhOyJOgQ'
const pusheenCurlyMouthCollapseTail = 'CAACAgUAAxkBAAJFNWh48V-BaDav8rPOLT5zzc63BYk9AALNGQACORLIV12jEExibjGWNgQ'

const enaQuestion = 'CAACAgUAAxkBAAIWQWQq3zA5c4RkNnBi-XYdX84jPL2UAALnBwACT2NoV5nfghMFXr4RLwQ'

const stickerFileIdMap = {
    AgADnQEAAjbsGwU: pusheenCollapseTail,
    AgADIAEAAoo3OAAB: pusheenCollapseTail,
    AgADNQMAAtcG0VQ: pusheenCollapseTail,
    AgADbgQAAlnE0FQ: pusheenCollapseTail,
    AgADRAEAAliiIUY: pusheenCollapseTail,
    AgADlgEAArsVGgg: pusheenCollapseTail,

    AgADZg0AAsZt6FY: pusheenCollapseTailSmile,
    AgAD7AADalkoRg: pusheenCollapseTailSmile,

    'AgAD9wADmY-lBw': pusheenStretchTail,

    AgADZgUAAimO2FQ: pusheenStretchTailSmall,
    AgADlwEAArsVGgg: pusheenStretchTailSmall,

    AgAD6QgAAhSouFY: pusheenCurlyMouthCollapseTail,

    AgADbQIAAoo3OAAB: pusheenBadminton,

    AgADzQYAAs9IYFc: enaQuestion,
}

export function balancePusheen(sticker) {
    if ('file_unique_id' in sticker) {
        return stickerFileIdMap[sticker.file_unique_id]
    }
    return undefined
}

export function cannotBalance(sticker) {
    return 'set_name' in sticker && sticker.set_name === 'balanced_pusheen'
}
