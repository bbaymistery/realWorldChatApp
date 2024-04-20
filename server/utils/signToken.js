const jwt = require("jsonwebtoken")

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECTER)

module.exports = signToken;
