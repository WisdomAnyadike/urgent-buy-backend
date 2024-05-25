const express = require('express')
const Router5 = express.Router()
const {adminSignUp , adminLogin } = require('../Controllers/AdminController')

Router5.post( '/adminSignup' , adminSignUp)
Router5.post( '/adminLogin' , adminLogin)

module.exports = Router5

