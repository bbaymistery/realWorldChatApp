const { emailMatch } = require("../constants");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "First Name is required"], },
    lastName: { type: String, required: [true, "Last Name is required"], },
    about: { type: String, },
    avatar: { type: String, },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: (email) => String(email).toLowerCase().match(emailMatch),
            message: (props) => `Email (${props.value}) is invalid!`,
        },
    },
    // unselect
    password: { type: String },
    // unselect
    passwordChangedAt: { type: Date },
    // unselect
    passwordResetToken: { type: String },
    // unselect
    passwordResetExpires: { type: Date },
    createdAt: { type: Date, default: Date.now() },
    // unselect
    updatedAt: { type: Date },

});


userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    //candidate pas is a pas whcih user supply to us 
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;