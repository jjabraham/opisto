const express = require('express')
const router = express.Router()
const auth = require('../lib/authentication')

// middleware that is specific to this router
router.use(auth.verifyJwt)

// define the home page route
router.get('/', function (req, res) {
  res.send('Secure O P I S T O !!')
})

module.exports = router
