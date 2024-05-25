const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    EMAIL: { type: String , required: true , unique:true } , 
    PASSWORD: { type: String , required: true  }
})

const adminModel = mongoose.model( 'AdminModel' , AdminSchema)

module.exports = adminModel