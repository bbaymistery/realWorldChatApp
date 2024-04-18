
const express = require("express");
const morgan = require("morgan");

//IF U Make request a high reate it result crashing servers so we use ratelimit
const rateLimit = require("express-rate-limit")

// when we send response back we have to set up some headers in the respose that we send 
//we r not gonna do it again again for each request so we use helmet 
const helmet = require("helmet");

const mongoSanitize = require('express-mongo-sanitize');

const bodyParser = require('body-parser')

const xss = require("xss")
const cors = require("cors")

const app = express()
// app.use(xss())
//!

app.use(express.urlencoded({ extended: true }))
app.use(mongoSanitize())
app.use(cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true
}))
app.use(express.json({ limit: "10kb" }))//we limit amount of data each request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(helmet())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
}

const limiter = rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000, //in one hour 
    message: "Too many req from this API ,Please try again in an hour "
})
//any request which start ;talk in that time that req will be limited
app.use("/talk", limiter)




module.exports = app