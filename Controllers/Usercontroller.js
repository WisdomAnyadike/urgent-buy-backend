const userModel = require('../Models/Usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendUserOtp = require('../Config/Mailer')

let genRandomNum = ()=> {
    let six = ''

    for (let index = 0; index < 6; index++) {
        let randomNum = Math.floor(Math.random() * 10)
        six += randomNum  
      
  }
  return six
   } 



const SignUp = async (req, res) => {
    const { FullName, Email, Password } = req.body
    if (!FullName || !Email || !Password) {
        res.status(400).send({ message: 'All fields are mandatory' })
    }
    try {
        const validateEmail = await userModel.findOne({ Email })
        if (validateEmail) {
            res.status(400).send({ message: 'Email is already in use' })
        } else {
            const hashedPassword = await bcrypt.hash(Password, 10)
            const createUser = await userModel.create({
                FullName,
                Email,
                Password: hashedPassword
            })
            if (createUser) {
                res.status(200).send({ message: `Account successfully created for ${FullName}` , status: "success"  } )

            } else {
                res.status(400).send({ message: `Couldnt create account for ${FullName}` , status: 'false' }    )
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
        console.log('Network error while posting to database' + error);

    }
}


const logIn = async(req, res)=> {
    const {Email , Password} = req.body
    if (!Email || !Password) {
        res.status(400).send({message:'All fields are mandatory'})    
    }
    try {
        const findUser = await userModel.findOne({Email})
        if (!findUser) {
          res.status(400).send({message:"Account doesnt exist , try creating an account" , status:"notcreated"}) 
        }else{
            const comparePassword = await bcrypt.compare(Password , findUser.Password)
            const secretKey = process.env.Jwt_SECRET
            const genToken = jwt.sign({
                user:{
                    FullName:findUser.FullName,
                    Email:findUser.Email
                }
            } , secretKey , {expiresIn:'1d'})

            if (comparePassword) {
                res.status(200).send({message:`Login Successful \n Welcome ${findUser.FullName}` , status:"success" , genToken , findUser })
                
            }else{
                res.status(400).send({message:`Incorrect password` , status:"false"}) 
            }
        }
        
    } catch (error) {
        res.status(500).send({message:`Internal server error` , status:"false"}) 
        console.log('Network error while logging in' , error);
    }
}


const editPassword = async(req, res)=> {
const user = req.user
const{FullName , Email} = user

if (!user) {
    res.status(400).send({message:"Authentication not provided"})
}else{
    const {Password} = req.body
    if(!Password){
        res.status(400).send({message:"Password Field is mandatory"})
    }else{
        try {  
            const hashedPassword = await bcrypt.hash(Password , 10)   
         const foundUser = await userModel.findOneAndUpdate({Email} , {
                    FullName, 
                    Email,
                    Password: hashedPassword
                } , { new: true})
    if (!foundUser) {
        res.status(400).send({message:"Couldnt update password"}) 
    }else {
        res.status(200).send({message:"Password successfully updated" , status:"okay"})
    }
              
        } catch (error) {
            res.status(400).send({message:"Internal server error"})
        }
    }
   
}



}

const editUserInfo = async(req, res)=> {
    const user = req.user

    if (!user) {
        res.status(400).send({message:"Authentication not provided"})
    }else{
        const {FullName , Email} = req.body
       const validateEmail = await userModel.findOne({Email})
     
        if(!FullName || !Email){
            res.status(400).send({message:"All Fields is mandatory"})
        } else if( FullName == user.FullName && Email == user.Email){
            res.status(400).send({message:"Update at least one field to continue"})
        }
        else if (validateEmail && (validateEmail.Email !== user.Email)) {
            res.status(400).send({message:"This Email is already in use by another customer"})
           }
    
        else{
            try {    
             const foundUser = await userModel.findOneAndUpdate({Email:user.Email} , {
                        FullName, 
                        Email,
                    } , { new: true})
        if (!foundUser) {
            res.status(400).send({message:"Couldnt update user information"}) 
        }else {
            res.status(200).send({message:"User information successfully updated" , status:"okay"})
            console.log("updated userinfo:" , {
                FullName, 
                Email,
            } );
        }              
            } catch (error) {
                console.log(error);
                res.status(400).send({message:"Internal server error"})
            }
        }
       
    }
    
    
    
    }


    const deleteAccount = async(req,res)=> {
        const user = req.user
        if(!user){
            res.status(400).send({message:"Authentication not provided"})
        }else{
            try {
                const userToDelete = await userModel.findOneAndDelete({Email:user.Email})
                if(!userToDelete){
                    res.status(400).send({message:"Unable to delete user at the moment" , status:"false"})
                }else{
                    res.status(200).send({message:"User successfully deleted" , status:"okay"})
                    console.log('deleted user', userToDelete);
                }
                
            } catch (error) {
                res.status(500).send({message:"internal server error" })
                console.log(error);
            }
        }
    }

    let theEmail

    const sendOtp = async(req,res)=> {
        const {Email} = req.body
        theEmail = Email
        if (!Email){
            res.status(400).send({message:"email is mandatory"})
        }else{
            try {
           const  validateEmail = await userModel.findOne({Email})
            if(!validateEmail){
                res.status(400).send({message:"User doesnt exist"})  
            }else{
                let userOtp = genRandomNum()
            sendUserOtp( userOtp , validateEmail.FullName , Email )
            res.status(200).send({message:"OTP has been sent Successfully" , status:"okay" ,  userOtp }) 
            }
             
            } catch (error) {
                res.status(500).send({message:"internal server error"})  
                console.log(error);
            }
        }


    }

    const changePassword = async(req , res) => {
          const {Password} = req.body
          if(!Password){
            res.status(400).send({message:"password is mandatory"})
          }else{
            try {
                const hashedPassword = await bcrypt.hash(Password , 10)
                const checkEmail = await userModel.findOneAndUpdate({Email:theEmail} , {
                    Password: hashedPassword
                } , {new:true})
                if(!checkEmail){
                    res.status(400).send({message:"Password Failed to Update"})    
                }else {
                    res.status(200).send({message:"Password successfully updated" , status:"okay"})    
                }
            } catch (error) {
                res.status(500).send({message:"internal server error"})  
                console.log(error); 
            }
          }

    }



module.exports = {SignUp , logIn , editPassword , editUserInfo , deleteAccount , sendOtp , changePassword}