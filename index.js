const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const mongoose = require('mongoose')
const helmet = require('helmet')
const debug = require('debug')('app-server')
const compression = require('compression')
require('dotenv').config()

const app = express()
const port = process.env.APP_PORT
const server = process.env.APP_SERVER
// const auth = require('./lib/authentication')
const router = require('./router/router')
const secureRouter = require('./router/secure-router')

mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`)

app.use(helmet())
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
//   res.header('Access-Control-Allow-Credentials', 'true')
//   next()
// })
app.use(compression())
app.use(bodyParser.json())

app.use('/', router)
app.use('/api', secureRouter)

app.listen(port, server, () => {
  debug(
    chalk.white.bgGreen.bold(`O P I S T O (env:${process.env.NODE_ENV}) is listening on ${server}:${port}`)
  )
})
