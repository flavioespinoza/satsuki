const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send({response: 'Trade that BIATCH! ;)'}).status(200)
})

module.exports = router