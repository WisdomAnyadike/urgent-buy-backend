const mongoose =  require('mongoose')

const TransactionSchema = new mongoose.Schema({
    transactionAmount: { type: Number , required: true  } ,
    transactionReference : {type: String , required:true},
    transactionStatus : {type: String , required:true} ,
    transactionUser : {type: String , required:true} ,
    transactionType: {type: String , required:true} 
} , {timestamps:true})



const transactionModel  = mongoose.model( "TransactionModel" , TransactionSchema)

module.exports = transactionModel