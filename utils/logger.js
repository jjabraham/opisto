const bunyan = require('bunyan')
const path = require('path')
const appName = require('../package.json').name


const log = bunyan.createLogger({
  name: appName,
  streams: [
    {
      level: 'info',
      path: path.normalize(
        path.join(
          path.basename(__dirname),
          `../logs/${appName}.log`
        )
      )
    }
  ]
})

module.exports = log
