const transactionModel = require("../Models/TransactionModel")
const axios = require('axios')
const paystackSecret = process.env.paystackSecret


const CreateTransaction = async (req, res) => {
    const { transactionReference } = req.body
    if(  !transactionReference  ){
        res.status(400).send({message:" reference is not provided"})
    }else{

        try {

      const paymentResponse = await axios.get(`https://api.paystack.co/transaction/verify/${transactionReference}` , {
    headers: {
        authorization: `Bearer ${paystackSecret}`,
        "content-type": "application/json",
        "cache-control": "no control" 
    },
        
})

console.log('payment response:' , paymentResponse.data);

if(paymentResponse.data.data.status !== 'success'){
    res.status(400).send({message:" Oops , Payment not completed , try again" , status:false })
} else {

    try {
        const createdTransaction = await transactionModel.create({
            transactionAmount: (paymentResponse.data.data.amount / 100) , 
            transactionReference : transactionReference , 
             transactionStatus : paymentResponse.data.data.status,   
             transactionUser : paymentResponse.data.data.metadata.FullName , 
             transactionType : "credit"
        })

        if(!createdTransaction){
            res.status(400).send({message:"Unable to create transaction" , status:false})   
        }else{
            res.status(200).send({  message: 'Verification successful', status:'okay' , createdTransaction }) 
            console.log('Created Transaction', createdTransaction );
        }
        
    } catch (error) {
        res.status(500).send({message:"Internal server error" , status:false})  
        console.log('error while creating transaction' , error);
    }

}
            
        } catch (error) {
            res.status(500).send({message:error.response.data.message , status:false})  
            console.log('error while getting from paystack' , error.response.data); 
        }



        
     
    }

}


const getTransactions = async(req , res)=> {
    try {
   const Transactions = await transactionModel.find()
        if(!users){
            res.status(400).send({message:'couldnt fetch transactions' , status:false})
        }else{
            res.status(200).send({message:'Transactions fetched successfully' , status:'okay' ,  data:Transactions })
        }
        
    } catch (error) {
        res.status(500).send({message:'Internal server error' , status:false }) 
        console.log('fetching error' , error);
    }
}

module.exports = {CreateTransaction , getTransactions}