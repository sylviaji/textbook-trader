// function to clean the isbn text
function clean(isbn) {
    const nums = '0123456789'
    return isbn.split('').filter(x => nums.includes(x)).join('')
}

// reference: https://en.wikipedia.org/wiki/International_Standard_Book_Number

function sum10(isbn) {
    if ((clean(isbn)).length !== 10) return undefined
    let res = 0
    for (let i = 0; i < isbn.length; i++) {
        res += parseInt(isbn.charAt(i)) * (10 - i)
    }
    return res
}

function sum13(isbn) {
    if ((clean(isbn)).length !== 13) return undefined
    const weight = [1, 3]
    let res = 0
    for (let i = 0; i <isbn.length; i++) {
        res += parseInt(isbn.charAt(i)) * weight[i % 2]
    }
    return res
}

function isValid(isbn) {
    const x = clean(isbn)
    switch (x.length) {
        case 10:
            return (sum10(x) % 11 === 0)
            break
        case 13:
            return (sum13(x) % 10 === 0)
            break
        default:
            return false
    }
}

class Isbn {
    constructor(text) {
        this.text = text
        this.valid = isValid(text)
        this.isbn = parseInt(clean(text))
    }
}

module.exports = {
    clean: clean,
    sum10: sum10,
    sum13: sum13,
    isValid: isValid,
    Isbn: Isbn
}