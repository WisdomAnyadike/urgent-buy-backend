const express = require('express');
const env = require('dotenv').config()
const connectDb = require('./Config/Dbconnect');
const cors = require('cors');
const Router = require('./Routes/Userroutes');
const Router2 = require('./Routes/Productrouts');
const Router3 = require('./Routes/Notifyroutes');
const Router4 = require('./Routes/Transactionroutes');
const Router5 = require('./Routes/AdminRoutes');


const app = express()



const port = 4000 || process.env.Port

app.use(express.json({extended: true , limit:'500mb'}))


const allowedOrigins = [
    'https://blackdiamondluxe-sfv6.onrender.com',
    'https://blackdiamondluxe-eotr.onrender.com',
    'https://www.blackdiamondluxe.com'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    }
  }));



app.use('/Api/User' , Router )
app.use('/Api/Products' , Router2  )
app.use('/Api/Notify' , Router3  )
app.use('/Api/Transaction' , Router4 )
app.use('/Api/Admin' , Router5 )



app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
  });
  

connectDb()