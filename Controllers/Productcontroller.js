const { cloudinary } = require("../Config/Cloudinary")
const productModel = require("../Models/Productmodel")




const createProduct = async(req,res)=> {
    const {productName , productImage , productPrice , productDescription, productCategory} = req.body
    if( !productName || !productImage || !productPrice || !productDescription|| !productCategory){
        res.status(400).send({message:'all fields are mandatory'})

    }else {
        try {
            const imageUpload = await cloudinary.uploader.upload(productImage, {folder: 'Urgent buy images' })
            const productLink = imageUpload.secure_url
            const CreateProduct = await productModel.create({
                productName , 
                productImage : productLink ,
                productPrice , 
                productDescription, 
                productCategory
            })
          if(!CreateProduct){
            res.status(400).send({message:"Unable to Create Product" , status:"false"})
          }else {
            res.status(200).send({message:"Product Created Successfully" , status:"okay"})
            console.log('Product:' , CreateProduct) ;
          }


        } catch (error) {
            res.status(500).send({message:"internal server error" }) 
            console.log('server error:', error );
        }
    }


}


const getList = async (req, res)=> {
    try {
        const productList = await productModel.find()
        if (!productList) {
            res.status(400).send({message:"unable to fetch products" , status:"false"})
        }else {
            res.status(200).send({message:"products fetched successfully" , status:"okay" , data:productList})
            console.log('product list', productList);
        }
        
    } catch (error) {
        res.status(400).send({message:"internal server error"})
        console.log('server error', error);
    }

}

const getProductById = async (req, res) => {
  const id = req.params.id 
  if(!id){
    res.status(400).send({message:'id is not provided'})
  }else{
    try {
        const product = await productModel.findById(id)
        if (!product) {
            res.status(400).send({message:"product not found" , status:'false'} )
            
        }else {
            console.log('product found:', product);
            res.status(200).send({message:"product successfully fetched", status:"okay", product})
        }
    } catch (error) {
        res.status(400).send({message:"internal server error" } )
        console.log('server error', error);
    }
  }
};

const getProductByCategory = async (req, res)=> {
    const category = req.params.category
    if(!category){
      res.status(400).send({message:'category is not provided'})
    }else{
      try {
          const product = await productModel.find({productCategory:category})
          if (!product) {
              res.status(400).send({message:"products not found" , status:'false'} )
              
          }else {
              console.log('product found:', product);
              res.status(200).send({message:"products successfully fetched", status:"okay", product})
          }
      } catch (error) {
          res.status(400).send({message:"internal server error" } )
          console.log('server error', error);
      }
    }

}

module.exports = {createProduct , getList , getProductById , getProductByCategory}