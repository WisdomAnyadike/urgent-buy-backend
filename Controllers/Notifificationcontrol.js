const NotificationModel = require("../Models/NotifyModel")



const createNotification = async (req, res) => {
 const user = req.user
 if(!user){
    res.status(400).send({ message: "authentication not provided" })
 }else{

    const { ProductName, ProductLike, ProductLiker } = req.body
    if (!ProductName || !ProductLike || !ProductLiker) {
        res.status(400).send({ message: "all fields are mandatory" })
    } else {
        try {
            console.log('working');
            const validateProduct = await NotificationModel.findOne({ ProductName })
            if (!validateProduct) {
                const UpdateProduct = await NotificationModel.create({
                    ProductName,
                    ProductLike,
                    ProductLiker: [ProductLiker]

                })
                if (UpdateProduct) {
        
                    res.status(200).send({ message: `${ProductLiker} liked ${ProductName}` , status:"okay" , timestamp: new Date().toISOString() , userNotify: `You liked ${ProductName}`})
                } else {
                    res.status(400).send({ message: "couldnt like post" })
                }
            } else {
                if (validateProduct.ProductLiker.includes(ProductLiker)) {
                    const arr = validateProduct.ProductLiker
                    const newArr = arr.filter((name) => name !== ProductLiker)
                    const UpdateProduct = await NotificationModel.findOneAndUpdate({ ProductName }, {
                        ProductName,
                        ProductLike: validateProduct.ProductLike - 1,
                        ProductLiker: newArr
                    }, { new: true })

                    if (UpdateProduct) {

                        res.status(200).send({ message: ` ${ProductLiker} unliked ${ProductName} `  , status:"okay" , timestamp: new Date().toISOString() , userNotify:`You Unliked ${ProductName}` })

                    } else {
                        res.status(400).send({ message: "couldnt like post" })
                    }

                } else {

                    const UpdateProduct = await NotificationModel.findOneAndUpdate({ ProductName }, {
                        ProductName,
                        ProductLike: validateProduct.ProductLike + 1,
                        ProductLiker: [...validateProduct.ProductLiker, ProductLiker] 
                    }, { new: true })

                    if (UpdateProduct) {
                        let [one, ...rest] = UpdateProduct.ProductLiker
                        if (UpdateProduct.ProductLiker.length > 3) {
                            res.status(200).send({ message: ` ${rest[Math.floor(Math.random * (rest.length - 2))]} , ${rest[rest.length - 1]}  & ${UpdateProduct.ProductLiker.length - 2} others liked ${ProductName} ` , status:"okay" ,  timestamp: new Date().toISOString() , userNotify: `You liked ${ProductName}` })
                        }else if (UpdateProduct.ProductLiker.length > 1) {
                            res.status(200).send({ message: `${rest[0]} & ${one} liked ${ProductName} `, status:"okay" , timestamp: new Date().toISOString() , userNotify: `You liked ${ProductName}` })
                        } else if (UpdateProduct.ProductLiker.length === 1) {
                            res.status(200).send({ message: `${one} liked ${ProductName} ` , status:"okay" ,  timestamp: new Date().toISOString() , userNotify: `You liked ${ProductName}`})
                        }


                    } else {
                        res.status(400).send({ message: "couldnt like post"  })
                    }

                }








            }

        } catch (error) {
            res.status(500).send({ message: "internal server error" })
            console.log(error);
        }



    }





 }







}

module.exports = createNotification