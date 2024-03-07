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
   const transactions = await transactionModel.find()
        if(!transactions){
            res.status(400).send({message:'couldnt fetch transactions' , status:false})
        }else{
            res.status(200).send({message:'Transactions fetched successfully' , status:'okay' ,  data:transactions })
        }
        
    } catch (error) {
        res.status(500).send({message:'Internal server error' , status:false }) 
        console.log('fetching error' , error);
    }
}

const getTransactionsByDateRange = async ( startDate, endDate) =>  {
    try {
        const transactions = await transactionModel.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });
        return transactions
    } catch (error) {
        res.status(400).send({message:'internal server error ' , status: false })
        console.log( 'error getting transaction by day' , error)
    }
}

const getTodaysTransactions = async (req, res) => {
       try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set start time to the beginning of today
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set end time to the end of today
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if(!transactions){
            res.status(400).send({message:'couldnt get todays transactions' , status: false })   
        }
        res.status(200).send({ message: 'Todays transactions fetched successfully', status: 'okay', data: transactions });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
}

const getYesterdaysTransactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1); // Set start date to yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Set end date to yesterday
        endDate.setHours(23, 59, 59, 999);
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if(!transactions){
            res.status(400).send({message:'couldnt get yesterdays transactions' , status: false })   
        }
        res.status(200).send({ message: 'yesterdays transactions fetched successfully', status: 'okay', data: transactions });    
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
  
}

const getDayBeforeYesterdaysTransactions = async (req,res) => {
    try {
        const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2); // Set start date to the day before yesterday
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 2); // Set end date to the day before yesterday
    endDate.setHours(23, 59, 59, 999);
    const transactions = await getTransactionsByDateRange(startDate, endDate);
    if(!transactions){
        res.status(400).send({message:'couldnt get dayBeforeYesterdays transactions' , status: false })   
    }
    res.status(200).send({ message: 'dayBeforeYesterdays transactions fetched successfully', status: 'okay', data: transactions }); 
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
    
}

const getDayBeforeDayBeforeYesterdaysTransactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 3); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if(!transactions){
            res.status(400).send({message:'couldnt get daybeforeDayBeforeyesterdays transactions' , status: false })   
        }
        res.status(200).send({ message: 'daybeforeDayBeforeyesterdays transactions fetched successfully', status: 'okay', data: transactions }); 
        
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
   
}

const getDay5Transactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 4); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 4); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if(!transactions){
            res.status(400).send({message:'couldnt get lastday transactions' , status: false })   
        }
        res.status(200).send({ message: 'Day5 transactions fetched successfully', status: 'okay', data: transactions }); 
        
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
   
}


module.exports = {CreateTransaction , getTransactions ,getTodaysTransactions, getYesterdaysTransactions, getDayBeforeYesterdaysTransactions , getDayBeforeDayBeforeYesterdaysTransactions , getDay5Transactions}