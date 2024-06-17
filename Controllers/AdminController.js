const adminModel = require("../Models/AdminModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const adminSignUp = async(req, res)=> {
    const {EMAIL , PASSWORD} = req.body 
    if( !EMAIL ||  !PASSWORD) {
        res.status(400).send({message:'all fields are mandatory'})
    } else {
        const verifyEmail = await adminModel.findOne({EMAIL})
        if(verifyEmail){
            res.status(400).send({message:'email is already in use'})    
        }else{
            const hashedPassword = await bcrypt.hash(PASSWORD , 10)
             const createAdmin = await adminModel.create({
                EMAIL ,
                PASSWORD : hashedPassword
             })

             if(!createAdmin){
                res.status(400).send({message:'couldnt create new admin'}) 
             }else {
                res.status(200).send({message:'admin created successfully'})
                console.log('created admin' , createAdmin);
             }


        }
    }



}


const adminLogin = async(req, res) => {
    const { EMAIL , PASSWORD} = req.body 
    if (!EMAIL || !PASSWORD){
        res.status(400).send({message:'all fields are mandatory'})   
    }else {
        const findAdmin = await adminModel.findOne({EMAIL})
        if (!findAdmin) {
            res.status(400).send({message:'Page Restricted'})   
        }else{
            const comparePasssword = await bcrypt.compare(  PASSWORD , findAdmin.PASSWORD ) 
            const secretKey = process.env.Jwt_SECRET
            const genToken = jwt.sign({
                user: {
                    FullName: findAdmin.FullName,
                    Email: findAdmin.Email
                }
            }, secretKey, { expiresIn: '1d' }) 
           if(!comparePasssword){
            res.status(400).send({message:'Password is incorrect'}) 
           }else {
            res.status(200).send({message:' Admin Login Successful' , status:"okay" , genToken}) 
            console.log('logged in admin' , findAdmin);
           }
        }

    }
}

module.exports = {adminLogin , adminSignUp}