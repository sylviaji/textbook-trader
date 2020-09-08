// helper function to find matching textbooks in the database
function match(str, objs) {
    if (!str) {return objs}
    const patterns = str.toLowerCase().split(' ')
    const res = objs.filter(obj => includesAll(patterns, obj.title.toLowerCase()))
    console.log(res)
    return res
}

function includesAll(patterns, title) {
    console.log(title)
    for (let i = 0; i < patterns.length; i++) {
        console.log(i, patterns.length - 1)
        if (!title.includes(patterns[i])) {
            console.log(patterns[i])
            console.log(title)
            return false
        }
        if (i === patterns.length - 1) {
            console.log('true')
            return true
        }
    }
}

module.exports = {
    match: match
}