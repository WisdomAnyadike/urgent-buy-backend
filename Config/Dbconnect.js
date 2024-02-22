
const mongoose = require('mongoose')



const connectDb = async()=> {
    const conectionstring = process.env.CONNECTION_STRING
    try {
        const connected = await mongoose.connect(conectionstring)
        if (connected) { 
            console.log('Database Connected Successfully');
            
        }else {
            console.log('Couldnt connect to database');
        }
        
    } catch (error) {
        console.log('Network error while connecting to database', error);
        
    }
 

  

}

module.exports = connectDb