const express = require('express')
const CreateTransaction = require('../Controllers/TransactionController')
const Router4 = express.Router()

Router4.post('/createTransaction' , CreateTransaction)

module.exports = Router4