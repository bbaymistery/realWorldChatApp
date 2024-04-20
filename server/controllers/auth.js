const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const signToken = require("../utils/signToken");

const otpGenerator = require('otp-generator');

//!What we did up untill now  
//!User come click to register  and submit details 
//!We send an OTP  to the user 
//!And when user submitted the OTP back yo use We verified it
//!After the otp is verified u get kicked into the application it means u logged in after that
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


exports.register = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    //direkt yukadan almak yerine filterObj func ile yapmak daha guvenlidir dedi
    const filteredBody = filterObj(req.body, "firstName", "lastName", "email", "password");

    // check if a verified user with given email exists

    const existing_user = await User.findOne({ email });

    // OTP=one time password 


    if (existing_user && existing_user.verified) {
        // user with this email already exists, Please login
        return res.status(400).json({
            status: "error",
            message: "Email already in use, Please login.",
        });
    } else if (existing_user) {
        // if not verified than update prev one

        await User.findOneAndUpdate({ email: email }, filteredBody, {
            new: true,
            validateModifiedOnly: true,
        });

        // generate an otp and send to email
        req.userId = existing_user._id;
        next();
    } else {
        // if user is not created before than create a new one
        const new_user = await User.create(filteredBody);

        // generate an otp and send to email
        req.userId = new_user._id;
        next();
    }
});


exports.sendOTP = catchAsync(async (req, res, next) => {
    const { userId } = req;

    const otpOptions = { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, }
    const new_otp = otpGenerator.generate(6, otpOptions);

    const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

    const user = await User.findByIdAndUpdate(userId, { otp_expiry_time });

    user.otp = new_otp.toString();

    await user.save({ new: true, validateModifiedOnly: true });

    console.log(new_otp);

    // TODO send mail

    res.status(200).json({
        status: "success",
        message: "OTP Sent Successfully!",
    });
});


exports.verifyOTP = catchAsync(async (req, res, next) => {
    // verify otp and update user accordingly
    const { email, otp } = req.body;
    // { $gt: Date.now()  =>mustbe greaterThan the current timestampt that means
    //When user has submitte the OTP and we r no processing in our backend 
    //then at that time whatever this time is : it has to be ahead of the expiry time
    //that means the expiry time is not yet reached (send otp ye bax + 10 * 60 * 1000) yazmisiq
    const user = await User.findOne({ email, otp_expiry_time: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "Email is invalid or OTP expired",
        });
    }

    if (user.verified) {
        return res.status(400).json({
            status: "error",
            message: "Email is already verified",
        });
    }

    if (!(await user.correctOTP(otp, user.otp))) {
        res.status(400).json({
            status: "error",
            message: "OTP is incorrect",
        });

        return;
    }

    // OTP is correct

    user.verified = true;
    user.otp = undefined;//deleting the value otp
    await user.save({ new: true, validateModifiedOnly: true });

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "OTP verified Successfully!",
        token,
        user_id: user._id,
    });
});