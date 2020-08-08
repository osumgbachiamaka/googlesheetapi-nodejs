
const express = require('express')
const router = express.Router()
const { retrieveUsers } = require('../controllers/retrieveFromSheet')
const { saveUsers } = require('../controllers/saveToSheet')

router.get('/v1/users', retrieveUsers)
router.post('/v1/update/users', saveUsers)

module.exports = router