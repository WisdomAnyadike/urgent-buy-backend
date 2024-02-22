const express = require('express')
const { createProduct, getList, getProductById, getProductByCategory } = require('../Controllers/Productcontroller')
const Router2 = express.Router()


Router2.post('/createProduct' , createProduct)
Router2.get('/getProducts' , getList)
Router2.get('/getProductById/:id' , getProductById)
Router2.get('/getProductsByCategory/:category' , getProductByCategory)
module.exports = Router2