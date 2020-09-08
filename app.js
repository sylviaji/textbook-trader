require('./db')
const isb = require('./utils/isbn')
const title = require('./utils/title')

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

const app = express()
app.set('view engine', 'hbs')

const User = mongoose.model('User')
const Textbook = mongoose.model('Textbook')

mongoose.set('useCreateIndex', true)

const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
}

app.use(session(sessionOptions))

const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.redirect('home')
})

app.get('/error', (req, res) => {
    const message = req.session.message
    const prev = req.session.prev
    res.render('error', {message: message, prev: prev})
})

app.get('/signup', (req, res) => {
    if (req.session.username) {
        res.redirect('/mine')
    } else {
        res.render('signup')
    }
})

app.get('/home', (req, res) => {
    Textbook.find({}, function(err, textbooks) {
        if (err) {
            req.session.message = 'Database Error.'
            req.session.prev = '/home'
            res.redirect('/error')
        } else {
            const objs = title.match(req.query.title, textbooks)
            res.render('home', {objs: objs})
        }
    })
})

app.get('/sell', (req, res) => {
    const filter = {'action': 'Buy'}
    Textbook.find(filter, function(err, textbooks) {
        res.render('sell', {objs: textbooks})
    })
})

app.get('/buy', (req, res) => {
    const filter = {'action': 'Sell'}
    Textbook.find(filter, function(err, textbooks) {
        res.render('buy', {objs: textbooks})
    })
})

app.get('/add-sell', (req, res) => {
    if (req.session.username) {
        res.render('add-sell')
    } else {
        req.session.prev = '/add-sell'
        res.redirect('/signup')
    }
})

app.post('/add-sell', (req, res) => {
    const username = req.session.username
    const isbnText = req.body.ISBN
    User.findOne({username: username}, function(err, user) {
        if (err) {
            req.session.message = 'Database Error.'
            req.session.prev = '/add-sell'
            res.redirect('/error')
        } else {
            const isbn = new isb.Isbn(isbnText)
            if (isbn.valid) {
                const newTextbook = new Textbook({
                    user: user,
                    contact: user.email,
                    action: 'Sell',
                    title: req.body.title,
                    isbn: isbn.isbn,
                    price: req.body.price
                })
                newTextbook.save(function(err) {
                    if (err) {
                        throw err
                    } else {
                        user.textbooks.push(newTextbook)
                        user.save(function(err) {
                            if (err) {
                                req.session.message = 'Failed to save to database.'
                                req.session.prev = '/add-sell'
                                res.redirect('/error')
                            } else {
                                res.redirect('/buy')
                            }
                        })
                    }
                })
            } else {
                req.session.message = 'ISBN not valid.'
                req.session.prev = '/add-sell'
                res.redirect('/error')
            }
        }
    })
})

app.get('/add-buy', (req, res) => {
    if (req.session.username) {
        res.render('add-buy')
    } else {
        req.session.prev = '/add-buy'
        res.redirect('/signup')
    }
})

app.post('/add-buy', (req, res) => {
    const username = req.session.username
    const isbnText = req.body.ISBN
    User.findOne({username: username}, function(err, user) {
        if (err) {
            req.session.message = 'Database Error.'
            req.session.prev = '/add-buy'
            res.redirect('/error')
        } else {
            const isbn = new isb.Isbn(isbnText)
            if (isbn.valid) {
                const newTextbook = new Textbook({
                    user: user,
                    contact: user.email,
                    action: 'Buy',
                    title: req.body.title,
                    isbn: isbn.isbn,
                    price: req.body.price
                })
                newTextbook.save(function(err) {
                    if (err) {
                        throw err
                    } else {
                        user.textbooks.push(newTextbook)
                        user.save(function(err) {
                            if (err) {
                                req.session.message = 'Failed to save to database.'
                                req.session.prev = '/add-buy'
                                res.redirect('/error')
                            } else {
                                res.redirect('/sell')
                            }
                        })
                    }
                })
            } else {
                req.session.message = 'ISBN not valid.'
                req.session.prev = '/add-buy'
                res.redirect('/error')
            }
        }
    })
})

app.get('/mine', (req, res) => {
    const username = req.session.username
    const textbooks = []
    if (username) {
        User.findOne({username: username}, function(err, user) {
            if (err) {
                req.session.message = 'Database Error.'
                req.session.prev = '/mine'
                res.redirect('/error')
            } else {
                const ids = user.textbooks
                if (ids.length === 0) {
                    res.render('mine', {username: username})
                }
                for (let i = 0; i < ids.length; i++) {
                    Textbook.findOne({_id: ids[i]}, function(err, textbook){
                        if (err) {
                            req.session.message = 'Database Error.'
                            req.session.prev = '/mine'
                            res.redirect('/error')
                        } else {
                            textbooks.push(textbook)
                            if (i === ids.length - 1) {
                                res.render('mine', {objs: textbooks, username: username})
                            }
                        }
                    })
                }
            }
        })
    } else {
        req.session.prev = '/mine'
        res.redirect('/signup')
    }
})

app.post('/register', (req, res) => {
    const username = req.body.username_register
    const email = req.body.email
    const password = req.body.password_register
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const textbooks = []

    const newUser = new User({
        username: username,
        email: email,
        hash: hash,
        salt: salt,
        textbooks: textbooks
    })
    newUser.save(function(err) {
        if (err) {
            req.session.message = 'An account with that username or email already exists.'
            req.session.prev = '/signup'
            res.redirect('/error')
        } else {
            req.session.user = username
            res.redirect('/home')
        }
    })
})

app.get('/login', (req, res) => {
    res.redirect('/signup')
})

app.post('/login', (req, res) => {
    const username =  req.body.username
    const password = req.body.password

    User.findOne({username: username}, function(err, user) {
        if (err) {
            req.session.message = 'Database Error.'
            req.session.prev = '/signup'
            res.redirect('/error')
        } else {
            if (!user) {
                req.session.message = 'Username does not exist.'
                req.session.prev = '/signup'
                res.redirect('/error')
            } else {
                const salt = user.salt
                const hash = bcrypt.hashSync(password, salt)
                if (hash === user.hash) {
                    req.session.username = username
                    res.redirect(req.session.prev || '/')
                } else {
                    req.session.message = 'Wrong password.'
                    req.session.prev = '/signup'
                    res.redirect('/error')
                }
            }
        }
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/signup')
})


app.listen(process.env.PORT || 3000)
console.log('listening to', process.env.PORT || 3000)
