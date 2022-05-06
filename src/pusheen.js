const pusheenCollapseTail = 'CAACAgUAAxUAAWJ0nUzdQBTWZ4iyMIKfE1X0Ej5UAAKABwACD3GhV71NHSno4gZeJAQ'
const pusheenStretchTail = 'CAACAgUAAxUAAWJ0nUz4mY2q2zR1cA1UoCiDds82AAJXBgACtzahVwh-zx9bs-H3JAQ'
const pusheenStretchTailSmall = 'CAACAgUAAxUAAWJ0p66fqz6uRleXSCx_71YAAVbr5wAC_gQAAhoqqVcFYK598VlajyQE'

const stickerFileIdMap = {
    AgADnQEAAjbsGwU: pusheenCollapseTail,
    AgADIAEAAoo3OAAB: pusheenCollapseTail,
    AgADNQMAAtcG0VQ: pusheenCollapseTail,
    AgADbgQAAlnE0FQ: pusheenCollapseTail,
    AgADRAEAAliiIUY: pusheenCollapseTail,

    'AgAD9wADmY-lBw': pusheenStretchTail,

    AgADZgUAAimO2FQ: pusheenStretchTailSmall,
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
