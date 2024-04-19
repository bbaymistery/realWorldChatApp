const jwt = require("jsonwebtoken")

//
const User = require("../models/user");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECTER)

exports.login = async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            status: "error",
            message: "Both email and password are required"
        })
    }
    //we include password field to userdatabse(when we fetch)
    const userDoc = await User.findOne({ email }).select("+password")


    if (!userDoc || await userDoc.correctPassword(password, userDoc.password)) {
        res.status(400).json({
            status: "error",
            message: "Email or password incorrect"
        })
    }


    const token = signToken(userDoc._id)

    res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        token,
        user_id: userDoc._id,
    })
}
