const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
    console.log(err);
    process.exit(1)
})

const http = require("http");

const server = http.createServer(app)

//mongo connection
const DB = process.env.DBURI.replace("<password>", process.env.DBPASSWORD)
const mongoseOptions = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(DB, mongoseOptions)
    .then((con) => {
        console.log(`Connected mongo db on=> : ${con.connection.host}:${con.connection.port}/${con.connection.name}`)
    })
    .catch((err) => { console.log(err) })



//3000 5000
const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log("App running on port " + `${port}`)
});


process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1)
    })
});