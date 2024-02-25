const express = require('express')
const createNotification = require('../Controllers/Notifificationcontrol')
const VerifyToken = require('../Middlewares/VerifyToken')
const Router3 = express.Router()

Router3.post('/createNotification' , VerifyToken,  createNotification)

module.exports = Router3