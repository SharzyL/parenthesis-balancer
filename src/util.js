class WorkerError extends Error {
    constructor(statusCode, ...params) {
        super(...params)
        this.statusCode = statusCode
    }
}

function escapeHtml(str) {
    const tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
    }
    return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag)
}

module.exports = {
    WorkerError,
    escapeHtml,
}
