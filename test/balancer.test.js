import assert from 'assert'
import { balanceParenthesis, PairCannotMatchError } from '../src/balancer.js'

describe('Test pairing', () => {
    it('should work for normal pairs', () => {
        assert.strictEqual(balanceParenthesis('World is good'), '')
        assert.strictEqual(balanceParenthesis('('), ')')
        assert.strictEqual(balanceParenthesis('(('), '))')
        assert.strictEqual(balanceParenthesis('(()'), ')')
        assert.strictEqual(balanceParenthesis('([]){['), ']}')
        assert.strictEqual(balanceParenthesis('«»«»'), '')
        assert.strictEqual(balanceParenthesis('«»«'), '»')
        assert.strictEqual(balanceParenthesis('«《》'), '»')
    })

    it('should be silent for normal sentences', () => {
        assert.strictEqual(balanceParenthesis('WORLD IN CRISIS!'), '')
    })

    it('should throw errors when cannot match', () => {
        assert.throws(() => balanceParenthesis('())'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('[(]'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('(»»)'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('»»)'), PairCannotMatchError)
        assert.throws(() => balanceParenthesis('(»»)'), PairCannotMatchError)
    })
})
