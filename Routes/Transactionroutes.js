const express = require('express')
const { getTransactions, CreateTransaction } = require('../Controllers/TransactionController')

const Router4 = express.Router()

Router4.post('/createTransaction' , CreateTransaction )
Router4.get('/getTransactions' , getTransactions)
module.exports = Router4