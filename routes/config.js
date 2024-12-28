const express = require('express')
const router = express.Router()
const ConfigController = require('../controllers/config')

router.post('/service', ConfigController.createService)
router.delete('/service', ConfigController.deleteService)
router.post('/list-services', ConfigController.listServices)


module.exports = router