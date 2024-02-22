const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
 {
    FullName:{ type: String , required: [true , 'Full name is required']  } ,
    Email: { type : String , required: [true , 'Email is required' ] , unique: [true , 'Email must be unique']} ,
    Password: {type: String , required: [true , 'Password is required'] }
 }, {timestamps: true}
)

const userModel = mongoose.model('UserSchema' , userSchema )

module.exports = userModel