const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const signToken = require("../utils/signToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpGenerator = require('otp-generator');
const mailService = require('../services/mailer')
const otp = require("../Templates/Mail/otp");
const resetPassword = require("../Templates/Mail/resetPassword");
const { promisify } = require("util");
//Signup =>register =>send otp => verify otp 

// User Login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;


    if (!email || !password) {
        res.status(400).json({
            status: "error",
            message: "Both email and password are required",
        });
        return;
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !user.password) {
        res.status(400).json({
            status: "error",
            message: "Incorrect password",
        });

        return;
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(400).json({
            status: "error",
            message: "Email or password is incorrect",
        });

        return;
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "Logged in successfully!",
        token,
        user_id: user._id,
    });
});

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

    //!we have problem here 
    // TODO send mail
    // mailService.sendEmail({
    //     from: "elgun1993-93@gmail.com",
    //     to: user.email,
    //     subject: "Verification OTP",
    //     html: otp(user.firstname, new_otp),
    //     attachments: [],
    // })



    res.status(200).json({
        status: "success",
        message: "OTP Sent Successfully!",
        otp: new_otp
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


exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            message: "You are not logged in! Please log in to get access.",
        });
    }
    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECTER);


    // 3) Check if user still exists

    const this_user = await User.findById(decoded.userId);

    if (!this_user) {
        return res.status(401).json({
            message: "The user belonging to this token does no longer exists.",
        });
    }
    // 4) Check if user changed password after the token was issued
    //bir profili ikinefer isledir
    //diyelimki 10:15de user log in etdi 
    //sonra baska user 10:20de passwordu reset etdi
    //After the pas reset we shouldnt allow any request from the user who logged in at 10:15

    if (this_user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
            message: "User recently changed password! Please log in again.",
        });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = this_user;
    next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "There is no user with email address.",
        });
    }

    // 2) Generate the random reset token
    //https://..?code=adasdasdasd    << reset token 
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
        const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;
        // TODO => Send Email with this Reset URL to user's email address
        const resetUrl_2 = `/auth/new-password?token=${resetToken}`
        // mailService.sendEmail({
        //   from: "elgun.ezmemmedov@gmail.com",
        //   to: user.email,
        //   subject: "Reset Password",
        //   html: resetPassword(user.firstName, resetURL),
        //   attachments: [],
        // });

        res.status(200).json({
            status: "success",
            note: "Mail service didnt work so i decided to do in this way",
            message: "Token sent to email!",
            resetURL,
            resetUrl_2,
            resetToken
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({
            message: "There was an error sending the email. Try again later!",
        });
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.body.token).digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() }, });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "Token is Invalid or Expired",
        });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "Password Reseted Successfully",
        token,
    });
});