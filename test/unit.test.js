const assert = require('assert')
const { balanceParenthesis, PairCannotMatchError } = require('../src/handler')

describe('Test pairing', () => {
    console.log(balanceParenthesis)
    it('should work for normal pairs', () => {
        assert.strictEqual(balanceParenthesis('World is good'), '')
        assert.strictEqual(balanceParenthesis('('), ')')
        assert.strictEqual(balanceParenthesis('(('), '))')
        assert.strictEqual(balanceParenthesis('(()'), ')')
        assert.strictEqual(balanceParenthesis('([]){['), ']}')
    })

    it('should be silent for normal sentences', () => {
        assert.strictEqual(balanceParenthesis('WORLD IN CRISIS!'), '') 
    })

    it('should handle apostrophe correctly', () => {
        assert.strictEqual(balanceParenthesis('I\'am good'), '') 
    })

    it('should throw errors when cannot match', () => {
        assert.throws(() => balanceParenthesis('())'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('[(]'), PairCannotMatchError)
    })

    it('should works with reversible pairs', () => {
        assert.strictEqual(balanceParenthesis('«»«»'), '')
        assert.strictEqual(balanceParenthesis('«»«'), '»')
        assert.strictEqual(balanceParenthesis('»»'), '««')
        assert.strictEqual(balanceParenthesis('»»❝❞'), '««')
        assert.strictEqual(balanceParenthesis('»»❝'), '««❞')
    })

    it('should throw errors with reversible pairs', () => {
        assert.throws(() => balanceParenthesis('(»»❝❞)'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('»»❝❞)'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('(»»❝❞)'), PairCannotMatchError)
    })

    it('should works with chaotic pairs', () => {
        '”„“', '’‚‘', '"', '\'',
        assert.strictEqual(balanceParenthesis('’‚‘'), '’')
        assert.strictEqual(balanceParenthesis('‘‚'), '')
        assert.strictEqual(balanceParenthesis('("")‚'), '’')
    })

    it('should throw errors with chaotic pairs', () => {
        assert.throws(() => balanceParenthesis('(""")', PairCannotMatchError))
        assert.throws(() => balanceParenthesis('("‚")', PairCannotMatchError))
    })
})
