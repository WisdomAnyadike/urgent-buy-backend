const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    productName: {type:String , required: [true , 'Product name is required'] , trim: true },
    productDescription:{type:String , required:true },
    productPrice:{type:Number , required: true} ,
    productImage:{type:String , required: true} ,
    productCategory:{type:String , required:true , enum : ['Hats' , 'Jackets' , 'Trainers' , 'Womens' , 'Mens']}
   
} , {timestamps: true})


const productModel = mongoose.model( "ProductModel" ,  ProductSchema)

module.exports = productModel