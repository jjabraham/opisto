var express = require('express')
var router = express.Router()
const auth = require('../lib/authentication')


// define the home page route
router.get('/', (req, res) => {
  res.send('O P I S T O !!')
})

router.post('/login', (req, res) => {
  auth.authenticate(req, res)
})

module.exports = router
