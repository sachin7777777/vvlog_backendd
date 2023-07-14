
const { signup, login, logout, auth } = require('../controller/user')

const route = require('express').Router()

route.post('/signup',signup)
route.post('/login',login)
route.post('/logout',logout)
route.get('/auth',auth)

module.exports = route
