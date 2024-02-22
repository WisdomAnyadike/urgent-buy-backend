const express = require('express');
const env = require('dotenv').config()
const connectDb = require('./Config/Dbconnect');
const cors = require('cors');
const Router = require('./Routes/Userroutes');
const Router2 = require('./Routes/Productrouts');

const app = express()
const port = 4000 || process.env.Port
app.use(express.json())
app.use(cors({origin:'*'}))
app.use('/Api/User' , Router )
app.use('/Api/Products' , Router2  )


app.listen(port , ()=> {
    console.log(`app is running on http://localhost:${port}`);
})

connectDb()