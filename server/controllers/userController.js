const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");


exports.updateMe = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, "firstName", "lastName", "about", "avatar");

    const userDoc = await User.findByIdAndUpdate(req.user._id, filteredBody);
    const respond = { status: "success", data: userDoc, message: "User Updated successfully" }
    res.status(200).json(respond);
});
