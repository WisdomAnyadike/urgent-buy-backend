const express = require('express');
const https = require('https');
const fs = require('fs');
const env = require('dotenv').config()
const connectDb = require('./Config/Dbconnect');
const cors = require('cors');
const Router = require('./Routes/Userroutes');
const Router2 = require('./Routes/Productrouts');
const Router3 = require('./Routes/Notifyroutes');
const Router4 = require('./Routes/Transactionroutes');
const Router5 = require('./Routes/AdminRoutes');


const app = express()

const options = {
    key: fs.readFileSync('/path/to/your/private.key'),
    cert: fs.readFileSync('/path/to/your/certificate.crt'),
    ca: fs.readFileSync('/path/to/your/ca_bundle.crt'), // If you have intermediate certificates
    secureOptions: https.constants.SSL_OP_NO_TLSv1 | https.constants.SSL_OP_NO_TLSv1_1,
    ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA256:ECDHE-RSA-AES128-SHA256',
    honorCipherOrder: true
  };

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



https.createServer(options, app).listen(port, () => {
    console.log(`App is running on https://localhost:${port}`);
  });
  

connectDb()