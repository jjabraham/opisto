const User = require('../user/model')
const jwt = require('jsonwebtoken')
const log = require('../../utils/logger')
const error = require('debug')('app-error')
const info = require('debug')('app-info')

const authenticate = {
  verifyJwt: (req, res, next) => {
    const token = req.headers[process.env.JWT_HEADER]
      ? req.headers[process.env.JWT_HEADER]
      : null
    info('recovered token', token)
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (payload) {
        info('payload', payload)
        if (!payload.active) {
          error('Inactive user')
          log.info({ message: 'Verify JWT: Inactive user', user: payload })
          res.sendStatus(403)
          return
        }
        req.user = payload
        next()
      } else {
        error('no payload')
        log.info('Verify JWT: no payload')
        res.sendStatus(401)
        return
      }
    } catch (err) {
      error('err payload', err)
      if (err.name === 'TokenExpiredError') {
        error('token expired')
        log.info('Verify JWT: token expired')
        res.sendStatus(401)
        return
      }
      log.info({ message: 'Verify JWT: err payload', token: token })
      res.sendStatus(401)
    }
  },
  authenticate: (req, res) => {
    if (req.body.username && req.body.password) {
      const username = req.body.username
      const password = req.body.password
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          error('user err')
          log.info({ message: 'Authentication: user err', username: username })
          res.sendStatus(401)
          return false
        }
        info('found user', user)
        if (!user) {
          error('user not found')
          log.info({
            message: 'Authentication: user not found',
            username: username,
          })
          res.sendStatus(401)
          return false
        }
        if (!user.active) {
          error('user not active')
          log.info({
            message: 'Authentication: user not active',
            username: username,
          })
          res.sendStatus(403)
          return false
        }
        if (!user.validPassword(password)) {
          log.info({
            message: 'Authentication: invalid password',
            username: username,
          })
          res.sendStatus(401)
          return false
        }
        const payload = {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          active: user.active,
          permissions: user.permissions,
        }
        info('payload', payload)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        })
        info(token)
        log.info({
          message: 'Successful authentication',
          username: username,
        })
        res.json({ token: token })
      })
    } else {
      log.info({ message: 'Authentication: no credentials' })
      res.sendStatus(401)
      return
    }
  },
  authorize: requirePermission => {
    return function(req, res, next) {
      const perms = req.user.permissions
      info('perms[0]', perms[0])
      if (perms[0] === 'All') {
        next()
        return
      }
      const result = perms.find(perm => {
        return perm.id === requirePermission
      })
      if (result) {
        next()
        return
      } else {
        error('Insufficient privileges')
        log.info({
          message: 'Authorization: Insufficient privileges',
          username: req.user.username,
          permissions: perms,
          triedToAccess: requirePermission,
        })
        res.sendStatus(403)
        return
      }
    }
  },
}

module.exports = authenticate
