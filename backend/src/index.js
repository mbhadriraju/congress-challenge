require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
const indexRouter = require('../index/route')
const profileRouter = require('../profile/route')
const questRouter = require('../quest/route')
const loginRouter = require('../login/route')
const signupRouter = require('../signup/route')
const changePasswordRouter = require('../change-password/route')

const port = 5000


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.use('/index', indexRouter)
app.use('/profile', profileRouter)
app.use('/quest', questRouter)
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/change-password', changePasswordRouter)

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`)
})


  