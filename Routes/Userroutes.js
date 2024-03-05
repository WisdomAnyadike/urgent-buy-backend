const express = require('express')
const {SignUp, logIn, editPassword, editUserInfo, deleteAccount, sendOtp, changePassword, getUsers } = require('../Controllers/Usercontroller')
const VerifyToken = require('../Middlewares/VerifyToken')
const Router = express.Router()


Router.post('/signup' , SignUp)
Router.post('/login' , logIn)
Router.post('/editPassword' , VerifyToken , editPassword)
Router.post('/editUserInfo' , VerifyToken , editUserInfo)
Router.post('/deleteUser' , VerifyToken , deleteAccount)
Router.post('/getOtp' ,  sendOtp)
Router.post('/changePassword' ,  changePassword)
Router.get('/getUsers' ,  getUsers)
module.exports = Router