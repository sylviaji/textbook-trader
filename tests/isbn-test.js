// npx mocha isbn-test.js

const chai = require('chai')
const expect = chai.expect
const path = require('path')
Object.assign(global, require(path.join(__dirname, '../utils/isbn.js')))

describe('clean', function() {
    it('returns a string with only digits in the original string', function() {
        expect(clean('978-0984782857')).to.equal('9780984782857')
        expect(clean('0-306-40615-2')).to.equal('0306406152')
        expect(clean('978-0-306-40615-7')).to.equal('9780306406157')
    })
})

describe('sum10', function() {
    it('returns undefined if input is not a 10-digit ISBN', function() {
        expect(sum10('9780984782857')).to.equal(undefined)
    })

    it('returns the sum of all ten digits in an ISBN-10 each multiplied by a weight', function() {
        expect(sum10('0984782869')).to.equal(308)
    })
})

describe('sum13', function() {
    it('returns undefined if input is not a 13-digit ISBN', function() {
        expect(sum13('0984782869')).to.equal(undefined)
    })

    it('returns the sum of all ten digits in an ISBN-13 each multiplied by a weight', function() {
        expect(sum13('9780984782857')).to.equal(140)
    })
})

describe('isValid', function() {
    it('returns false if the ISBN is not 10 or 13 digit', function() {
        expect(isValid('999')).to.equal(false)
        expect(isValid('978-09847828578')).to.equal(false)
    })

    it ('returns true if an ISBN is valid', function() {
        expect(isValid('978-0984782857')).to.equal(true)
        expect(isValid('0-306-40615-2')).to.equal(true)
    })

    it('returns false if an ISBN is invalid', function() {
        expect(isValid('978-0984782850')).to.equal(false)
        expect(isValid('0-306-40615-3')).to.equal(false)
    })
})