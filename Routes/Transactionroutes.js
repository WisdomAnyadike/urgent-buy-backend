const express = require('express')
const { getTransactions, CreateTransaction, getTodaysTransactions, getYesterdaysTransactions, getDayBeforeYesterdaysTransactions, getDayBeforeDayBeforeYesterdaysTransactions, getDay5Transactions, getLastThirtyDaysTransactions, confirmPaymentStatus, getUserTransactions } = require('../Controllers/TransactionController')
const VerifyToken = require('../Middlewares/VerifyToken')

const Router4 = express.Router()

Router4.post('/createTransaction', CreateTransaction)
Router4.get('/getTransactions', getTransactions)
Router4.get('/getTransactions1', getTodaysTransactions)
Router4.get('/getTransactions2', getYesterdaysTransactions)
Router4.get('/getTransactions3', getDayBeforeYesterdaysTransactions)
Router4.get('/getTransactions4', getDayBeforeDayBeforeYesterdaysTransactions)
Router4.get('/getTransactions5', getDay5Transactions)
Router4.get('/getMonthlyTransactions', getLastThirtyDaysTransactions)
Router4.post('/confirmStatus/:id', confirmPaymentStatus)
Router4.get('/getUserTransactions', VerifyToken , getUserTransactions)
module.exports = Router4