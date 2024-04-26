const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const FriendRequest = require("../models/friendRequest");

exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({ status: "success", data: req.user, });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, "firstName", "lastName", "about", "avatar");
    const userDoc = await User.findByIdAndUpdate(req.user._id, filteredBody);
    const respond = { status: "success", data: userDoc, message: "User Updated successfully" }
    res.status(200).json(respond);
});

//*exclude me and my friends(remiving me and my friends from the list )
exports.getUsers = catchAsync(async (req, res, next) => {
    //we want only theese 3 properties firstName.. ... .. 
    const all_users = User.find({ verified: true }).select("firstName lastName _id");

    const this_user = req.user //protect e bax goreceysen orda req.user=this__user   yazmisiq Onu req.user ile alrq

    //making sure that we r sending only those users who are not our friends already
    const remaining_users = all_users.filter((user) =>
        !this_user.friends.includes(user._id) &&//exclue all of my current friend
        user._id.toString() !== req.user._id.toString()//exclude myself
    );
    res.status(200).json({
        status: "success",
        data: remaining_users,
        message: "Users found successfully!",
        this_user,//kendim ekledim 
        all_users//kendim ekledim gorum deye
    });
});


//*for friend requests 
exports.getRequests = catchAsync(async (req, res, next) => {
    const requests = await FriendRequest.find({ recipient: req.user._id })
        .populate("sender")
        .select("_id firstName lastName");

    res.status(200).json({
        status: "success",
        data: requests,
        message: "Requests found successfully!",
    });
});

//*gert my friends 
exports.getFriends = catchAsync(async (req, res, next) => {
    const this_user = await User.findById(req.user._id).populate("friends", "_id firstName lastName");
    res.status(200).json({
        status: "success",
        data: this_user.friends,
        message: "Friends found successfully!",
    });
});


//*men xaric butun verified userler
exports.getAllVerifiedUsers = catchAsync(async (req, res, next) => {
    const all_users = await User.find({ verified: true, }).select("firstName lastName _id");
    const remaining_users = all_users.filter((user) => user._id.toString() !== req.user._id.toString());

    res.status(200).json({
        status: "success",
        data: remaining_users,
        message: "Users found successfully!",
    });
});