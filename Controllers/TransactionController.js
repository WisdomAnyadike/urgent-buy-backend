const transactionModel = require("../Models/TransactionModel")
const axios = require('axios')
const userModel = require("../Models/Usermodel")
const { orderPendingMssg, finalOrderStatusMssg, pendingOrderMssg } = require('../Config/Mailer')


function genRef() {
    let ref = ''
    let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o']

    for (let index = 0; index < 8; index++) {
        let randomUID = Math.floor(Math.random() * arr.length)
        ref += arr[randomUID]
    }
    return ref
}

// const paystackSecret = process.env.paystackSecret
// const { Client, Environment } = require('square');


// const client = new Client({
//     environment: Environment.Sandbox, // Use Environment.Production for live transactions
//     accessToken: 'EAAAlzPleLIXZOu8bK8aZVvxQDj3rhfyouYsF-l-vK_Fc9YQcMfs4HLJnkV2LZ8A' 
// });


// const CreateTransaction = async (req, res) => {
//     const { transactionReference } = req.body
//     if (!transactionReference) {
//         res.status(400).send({ message: " reference is not provided" })
//     } else {

//         try {

//             const paymentResponse = await axios.get(`https://api.paystack.co/transaction/verify/${transactionReference}`, {
//                 headers: {
//                     authorization: `Bearer ${paystackSecret}`,
//                     "content-type": "application/json",
//                     "cache-control": "no control"
//                 },

//             })

//             console.log('payment response:', paymentResponse.data);

//             if (paymentResponse.data.data.status !== 'success') {
//                 res.status(400).send({ message: " Oops , Payment not completed , try again", status: false })

//             } else {

//                 try {
//                     const createdTransaction = await transactionModel.create({
//                         transactionAmount: (paymentResponse.data.data.amount / 100),
//                         transactionReference: transactionReference,
//                         transactionStatus: paymentResponse.data.data.status,
//                         transactionUser: paymentResponse.data.data.metadata.FullName,
//                         transactionType: "credit"
//                     })

//                     if (!createdTransaction) {
//                         res.status(400).send({ message: "Unable to create transaction", status: false })
//                     } else {
//                         res.status(200).send({ message: 'Verification successful', status: 'okay', createdTransaction })
//                         console.log('Created Transaction', createdTransaction);
//                     }

//                 } catch (error) {
//                     res.status(500).send({ message: "Internal server error", status: false })
//                     console.log('error while creating transaction', error);
//                 }

//             }

//         } catch (error) {
//             res.status(500).send({ message: error.response.data.message, status: false })
//             console.log('error while getting from paystack', error.response.data);
//         }

//     }

// }


// const CreateTransaction2 = async (req, res) => {
//     const { sourceId, amountMoney, locationId, idempotencyKey } = req.body;

//     if (!sourceId || !amountMoney || !locationId || !idempotencyKey) {
//       return res.status(400).send({ message: "Required fields are missing" });
//     }

//     try {
//       const paymentsApi = client.paymentsApi;

//       const normalizedAmount = typeof 1000 === 'bigint' ? Number(1000) : 1000;



//       const requestBody =  {
//         sourceId: sourceId,
//         idempotencyKey: idempotencyKey ,
//         amountMoney: {
//           amount: normalizedAmount , // Ensure amount is an integer
//           currency: 'USD',
//         },
//         acceptPartialAuthorization: true
//       };

//       console.log(requestBody);
//       const response = await paymentsApi.createPayment(requestBody);
//       const safeResponse = JSON.parse(JSON.stringify(response, (key, value) =>
//       typeof value === 'bigint' ? value.toString() : value
//   ));
//       res.status(200).send({data:safeResponse});
//     } catch (error) {
//       console.error('Error processing payment', error);
//       res.status(500).json({
//         message: error.message,
//         details: error.errors,
//       });
//     }

// } 


const CreateTransaction = async (req, res) => {
    const { transactionAmount, transactionUser, transactionTag, transactionOrder, transactionEmail } = req.body
    if (!transactionAmount || !transactionUser || !transactionTag || !transactionOrder || !transactionEmail) {
        res.status(400).send({ message: "a cumpulsory field is not provided" })
    } else {
        try {
            const createdTransaction = await transactionModel.create({
                transactionAmount,
                transactionReference: genRef(),
                transactionStatus: 'pending...',
                transactionUser,
                transactionTag,
                transactionOrder,
                transactionEmail,
                transactionType: "credit"
            })

            if (!createdTransaction) {
                res.status(400).send({ message: "Unable to create transaction", status: false })
            } else {
                orderPendingMssg(transactionUser, transactionEmail, createdTransaction.transactionReference, transactionAmount, createdTransaction.createdAt.toLocaleDateString(), transactionOrder, transactionTag)

                pendingOrderMssg(transactionUser, transactionEmail, createdTransaction.transactionReference, transactionAmount, createdTransaction.createdAt.toLocaleDateString(), transactionOrder, transactionTag)
                
                res.status(200).send({ message: 'Verification successful', status: 'okay', createdTransaction })
                console.log('Created Transaction', createdTransaction);
            }

        } catch (error) {
            res.status(500).send({ message: "Internal server error", status: false })
            console.log('error while creating transaction', error);
        }

    }

}











const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find()
        if (!transactions) {
            res.status(400).send({ message: 'couldnt fetch transactions', status: false })
        } else {
            res.status(200).send({ message: 'Transactions fetched successfully', status: 'okay', data: transactions })
        }

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false })
        console.log('fetching error', error);
    }
}

const getTransactionsByDateRange = async (startDate, endDate) => {
    try {
        const transactions = await transactionModel.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });
        return transactions
    } catch (error) {
        res.status(400).send({ message: 'internal server error ', status: false })
        console.log('error getting transaction by day', error)
    }
}

const getTodaysTransactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set start time to the beginning of today
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set end time to the end of today
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if (!transactions) {
            res.status(400).send({ message: 'couldnt get todays transactions', status: false })
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
        if (!transactions) {
            res.status(400).send({ message: 'couldnt get yesterdays transactions', status: false })
        }
        res.status(200).send({ message: 'yesterdays transactions fetched successfully', status: 'okay', data: transactions });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}

const getDayBeforeYesterdaysTransactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 2); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 2); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        if (!transactions) {
            res.status(400).send({ message: 'couldnt get dayBeforeYesterdays transactions', status: false })
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
        if (!transactions) {
            res.status(400).send({ message: 'couldnt get daybeforeDayBeforeyesterdays transactions', status: false })
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
        if (!transactions) {
            res.status(400).send({ message: 'couldnt get lastday transactions', status: false })
        }
        res.status(200).send({ message: 'Day5 transactions fetched successfully', status: 'okay', data: transactions });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}


const getLastThirtyDaysTransactions = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Set start date to 30days ago
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);  // Set end date to today
        let transactionPerUser = []
        const transactions = await getTransactionsByDateRange(startDate, endDate);
        const users = await userModel.find()


        if (users && transactions) {
            users.forEach((user) => {
                const { FullName } = user
                const forOneUser = transactions.filter((transaction) => FullName === transaction.transactionUser)
                const transactionValue = forOneUser.reduce((a, b) => a + b.transactionAmount, 0)
                transactionPerUser.push({ user, transactionValue: transactionValue === null ? 0 : transactionValue })
            })

        }

        if (!transactionPerUser || transactionPerUser.length === 0) {
            return res.status(200).send({ message: 'No transactions found for the last thirty days', status: 'okay', data: [] });
        }

        res.status(200).send({ message: 'transactions from the last thirty day fetched successfully', status: 'okay', data: transactionPerUser });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}



let confirmPaymentStatus = async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({ message: "id not provided" })
    } else {
        const { status } = req.body
        if (!status) {
            res.status(400).send({ message: "status not provided" })
        } else {

            try {
                const updateStatus = await transactionModel.findByIdAndUpdate(id, { transactionStatus: status }, { new: true })

                if (!updateStatus) {
                    res.status(400).send({ message: "unable to update status", status: false })
                } else {
                    finalOrderStatusMssg(updateStatus.transactionUser, updateStatus.transactionEmail, updateStatus.transactionReference, updateStatus.transactionAmount, updateStatus.createdAt.toLocaleString(), updateStatus.transactionOrder, updateStatus.transactionTag, status)
                    res.status(200).send({ message: "status updated successfully", status: 'okay' })
                }

            } catch (error) {
                res.status(500).send({ message: 'Internal server error', status: false });
            }
        }



    }

}


const getUserTransactions = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).send({ message: 'Authentication not provided, try logging in' });
    }
    try {
        const userTransactions = await transactionModel.find({ transactionEmail: user.Email });

        if (!userTransactions || userTransactions.length === 0) {
            return res.status(404).send({ message: 'No transactions found', status: false });
        }

        return res.status(200).send({ message: 'Transactions fetched successfully', status: 'okay', data: userTransactions });
    } catch (error) {
        return res.status(500).send({ message: 'Internal server error', status: false });
    }
};


module.exports = { CreateTransaction, getTransactions, getTodaysTransactions, getYesterdaysTransactions, getDayBeforeYesterdaysTransactions, getDayBeforeDayBeforeYesterdaysTransactions, getDay5Transactions, getLastThirtyDaysTransactions, confirmPaymentStatus, getUserTransactions }

