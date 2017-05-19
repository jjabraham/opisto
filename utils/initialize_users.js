const User = require('../lib/user/model')
const mongoose = require('mongoose')
const chalk = require('chalk')
const error = require('debug')('app-error')
const info = require('debug')('app-info')
require('dotenv').config()

const users = [
  {username: 'john', password: 'john', firstName: 'John', lastName: 'Abraham', active: true,
    permissions: [
      'all'
    ]
  },
]

const mongoUri = process.env.DB_URI
const mongoDatabase = process.env.DB_NAME

mongoose.Promise = global.Promise

mongoose.connect(`${mongoUri}${mongoDatabase}`)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))


db.once('open', () => {
  mongoose.connection.collections['users'].drop((err) => {
    if (err) {
      error(chalk.red('error dropping collection users'))
      // return null
    }
    info(chalk.green('dropped collection users'))

    const userActions = []
    users.forEach(user => {
      let aUser = new User (user)
      userActions.push(aUser.save())
    })
    Promise.all(userActions)
    .then( values => {
      info(chalk.white.bgGreen.bold('Added the following users '), chalk.green(values))
      process.exit(0)
    })
    .catch( err => {
      error(chalk.white.bgRed.bold('error adding user'), chalk.red(err))
      process.exit(0)
    })
  })
})
