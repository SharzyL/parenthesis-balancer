const stickerFileIdMap = {
    // pusheen with tail collapsed
    AgADnQEAAjbsGwU: 'CAACAgUAAxUAAWJ0nUzdQBTWZ4iyMIKfE1X0Ej5UAAKABwACD3GhV71NHSno4gZeJAQ',
    AgADIAEAAoo3OAAB: 'CAACAgUAAxUAAWJ0nUzdQBTWZ4iyMIKfE1X0Ej5UAAKABwACD3GhV71NHSno4gZeJAQ',
    AgADNQMAAtcG0VQ: 'CAACAgUAAxUAAWJ0nUzdQBTWZ4iyMIKfE1X0Ej5UAAKABwACD3GhV71NHSno4gZeJAQ',

    // pusheen with tail stretched
    'AgAD9wADmY-lBw': 'CAACAgUAAxUAAWJ0nUz4mY2q2zR1cA1UoCiDds82AAJXBgACtzahVwh-zx9bs-H3JAQ',
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
