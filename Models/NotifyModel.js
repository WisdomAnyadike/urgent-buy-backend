const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    ProductName : { type:String , required: true } ,
    ProductLike : { type:Number , required: true }, 
    ProductLiker: {type:Array , required:true , trim:true } , 
    timestamp: {type:Date , default: Date.now}
}, {timestamps: true})

const NotificationModel = mongoose.model('notificationModel' , NotificationSchema)

module.exports = NotificationModel