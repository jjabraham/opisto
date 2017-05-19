const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const mongoose = require('mongoose')
const helmet = require('helmet')
const debug = require('debug')('app-server')
const compression = require('compression')
const router = require('./router/router')
const secureRouter = require('./router/secure-router')
require('dotenv').config()

const app = express()
const port = process.env.APP_PORT
const server = process.env.APP_SERVER

mongoose.connect(`${process.env.DB_URI}${process.env.DB_NAME}`)

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())

app.use('/', router)
app.use('/api', secureRouter)

app.listen(port, server, () => {
  debug(
    chalk.white.bgGreen.bold(`O P I S T O (env:${process.env.NODE_ENV}) is listening on ${server}:${port}`)
  )
})
