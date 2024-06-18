const userModel = require('../Models/Usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { signUpMssg, sendUserOtp } = require('../Config/Mailer')


let genRandomNum = () => {
    let six = ''

    for (let index = 0; index < 6; index++) {
        let randomNum = Math.floor(Math.random() * 10)//0-9 0.00 -0.99
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
                FullName: FullName.toLowerCase(),
                Email: Email.toLowerCase(),
                Password: hashedPassword
            })
            if (createUser) {
                signUpMssg(createUser.FullName, createUser.Email)
                res.status(200).send({ message: `Account successfully created for ${FullName}`, status: "success" })

            } else {
                res.status(400).send({ message: `Couldnt create account for ${FullName}`, status: 'false' })
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
        console.log('Network error while posting to database' + error);

    }
}


const logIn = async (req, res) => {
    const { Email, Password } = req.body
    if (!Email || !Password) {
        res.status(400).send({ message: 'All fields are mandatory' })
    }
    try {

        const findUser = await userModel.findOne({ Email: Email.toLowerCase() })
        if (!findUser) {
            res.status(400).send({ message: "Account doesnt exist , try creating an account", status: "notcreated" })
        } else {
            const comparePassword = await bcrypt.compare(Password, findUser.Password)
            const secretKey = process.env.Jwt_SECRET
            const genToken = jwt.sign({
                user: {
                    FullName: findUser.FullName,
                    Email: findUser.Email
                }
            }, secretKey, { expiresIn: '1d' })

            if (comparePassword) {
                
                res.status(200).send({ message: `Login Successful \n Welcome ${findUser.FullName}`, status: "success", genToken, findUser })

            } else {
                res.status(400).send({ message: `Incorrect password`, status: "false" })
            }
        }

    } catch (error) {
        res.status(500).send({ message: `Internal server error`, status: "false" })
        console.log('Network error while logging in', error);
    }
}


const editPassword = async (req, res) => {
    const user = req.user
    const { FullName, Email } = user

    if (!user) {
        res.status(400).send({ message: "Authentication not provided" })
    } else {
        const { Password } = req.body
        if (!Password) {
            res.status(400).send({ message: "Password Field is mandatory" })
        } else {
            try {
                const hashedPassword = await bcrypt.hash(Password, 10)
                const foundUser = await userModel.findOneAndUpdate({ Email }, {
                    FullName,
                    Email,
                    Password: hashedPassword
                }, { new: true })
                if (!foundUser) {
                    res.status(400).send({ message: "Couldnt update password" })
                } else {
                    res.status(200).send({ message: "Password successfully updated", status: "okay" })
                }

            } catch (error) {
                res.status(400).send({ message: "Internal server error" })
            }
        }

    }



}

const editUserInfo = async (req, res) => {
    const user = req.user

    if (!user) {
        res.status(400).send({ message: "Authentication not provided" })
    } else {
        const { FullName, Email, Picture } = req.body
        const validateEmail = await userModel.findOne({ Email })

        if (!FullName || !Email) {
            res.status(400).send({ message: "All Fields is mandatory" })
        } else if (FullName == user.FullName && Email == user.Email && Picture == user.Picture) {
            res.status(400).send({ message: "Update at least one field to continue" })
        }
        else if (validateEmail && (validateEmail.Email !== user.Email)) {
            res.status(400).send({ message: "This Email is already in use by another customer" })
        }

        else {
            try {
                const foundUser = await userModel.findOneAndUpdate({ Email: user.Email }, {
                    $set:
                    {
                        FullName,
                        Email,
                        Picture
                    }
                }, { new: true })
                if (!foundUser) {
                    res.status(400).send({ message: "Couldnt update user information" })
                } else {
                    res.status(200).send({ message: "User information successfully updated", status: "okay" })
                    console.log("updated userinfo:", {
                        FullName,
                        Email,
                        Picture
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(400).send({ message: "Internal server error" })
            }
        }

    }



}


const deleteAccount = async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).send({ message: "Authentication not provided" })
    } else {
        try {
            const userToDelete = await userModel.findOneAndDelete({ Email: user.Email })
            if (!userToDelete) {
                res.status(400).send({ message: "Unable to delete user at the moment", status: "false" })
            } else {
                res.status(200).send({ message: "User successfully deleted", status: "okay" })
                console.log('deleted user', userToDelete);
            }

        } catch (error) {
            res.status(500).send({ message: "internal server error" })
            console.log(error);
        }
    }
}

let theEmail

const sendOtp = async (req, res) => {
    const { Email } = req.body
    theEmail = Email
    if (!Email) {
        res.status(400).send({ message: "email is mandatory" })
    } else {
        try {
            const validateEmail = await userModel.findOne({ Email })
            if (!validateEmail) {
                res.status(400).send({ message: "User doesnt exist , Sign up" })
            } else {
                let userOtp = genRandomNum()

                sendUserOtp(userOtp, validateEmail.FullName, Email)
                res.status(200).send({ message: "OTP has been sent Successfully", status: "okay", userOtp })
            }

        } catch (error) {
            res.status(500).send({ message: "internal server error" })
            console.log(error);
        }
    }


}

const changePassword = async (req, res) => {
    const { Password } = req.body
    if (!Password) {
        res.status(400).send({ message: "password is mandatory" })
    } else {
        try {
            const hashedPassword = await bcrypt.hash(Password, 10)
            const checkEmail = await userModel.findOneAndUpdate({ Email: theEmail }, {

                Password: hashedPassword
            }, { new: true })
            if (!checkEmail) {
                res.status(400).send({ message: "Password Failed to Update" })
            } else {
                res.status(200).send({ message: "Password successfully updated", status: "okay" })
            }
        } catch (error) {
            res.status(500).send({ message: "internal server error" })
            console.log(error);
        }
    }

}


const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if (!users) {
            res.status(400).send({ message: 'couldnt fetch user data', status: false })
        } else {
            res.status(200).send({ message: 'Users fetched successfully', status: 'okay', data: users })
        }

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false })
        console.log('fetching error', error);
    }
}

const getUsersByDateRange = async (startDate, endDate) => {
    try {
        const Users = await userModel.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });
        return Users
    } catch (error) {
        res.status(400).send({ message: 'internal server error ', status: false })
        console.log('error getting transaction by day', error)
    }
}

const getTodaysUsers = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Set start time to the beginning of today
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // Set end time to the end of today
        const Users = await getUsersByDateRange(startDate, endDate);
        if (!Users) {
            res.status(400).send({ message: 'couldnt get todays Users', status: false })
        }
        res.status(200).send({ message: 'Todays Users fetched successfully', status: 'okay', data: Users });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }
}

const getYesterdaysUsers = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1); // Set start date to yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Set end date to yesterday
        endDate.setHours(23, 59, 59, 999);
        const Users = await getUsersByDateRange(startDate, endDate);
        if (!Users) {
            res.status(400).send({ message: 'couldnt get yesterdays Users', status: false })
        }
        res.status(200).send({ message: 'yesterdays Users fetched successfully', status: 'okay', data: Users });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}

const getDayBeforeYesterdaysUsers = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 2); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 2); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const Users = await getUsersByDateRange(startDate, endDate);
        if (!Users) {
            res.status(400).send({ message: 'couldnt get dayBeforeYesterdays Users', status: false })
        }
        res.status(200).send({ message: 'dayBeforeYesterdays Users fetched successfully', status: 'okay', data: Users });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}

const getDayBeforeDayBeforeYesterdaysUsers = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 3); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const Users = await getUsersByDateRange(startDate, endDate);
        if (!Users) {
            res.status(400).send({ message: 'couldnt get daybeforeDayBeforeyesterdays Users', status: false })
        }
        res.status(200).send({ message: 'daybeforeDayBeforeyesterdays Users fetched successfully', status: 'okay', data: Users });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}

const getDay5Users = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 4); // Set start date to the day before yesterday
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 4); // Set end date to the day before yesterday
        endDate.setHours(23, 59, 59, 999);
        const Users = await getUsersByDateRange(startDate, endDate);
        if (!Users) {
            res.status(400).send({ message: 'couldnt get lastday Users', status: false })
        }
        res.status(200).send({ message: 'Day5 Users fetched successfully', status: 'okay', data: Users });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', status: false });
    }

}




module.exports = { SignUp, logIn, editPassword, editUserInfo, deleteAccount, sendOtp, changePassword, getUsers, getTodaysUsers, getYesterdaysUsers, getDayBeforeYesterdaysUsers, getDayBeforeDayBeforeYesterdaysUsers, getDay5Users }