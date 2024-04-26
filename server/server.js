const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io")

process.on("uncaughtException", (err) => {
    console.log(err);
    process.exit(1)
})

const http = require("http");
const User = require("./models/user");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

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
//check app js we made example connection
io.on("connection", async (socket) => {
    const user_id = socket.handshake.query.user_id;


    const socket_id = socket.id;
    // console.log(socket);
    console.log({ user_id, socket_id });
    if (user_id) {
        await User.findByIdAndUpdate(user_id, { socket_id })
    }
    //We can write our socket event listeners here 

    //!I am user a.  I have sent a friend req with (to:"id" )
    socket.on("friend_request", async (data) => {
        console.log(data.to)

        //{to:"65775757"}

        const to = await User.findById(data.to)
        //So i must send an alert to the user with this "65775757" id that u have received a new friend req 
        //Onuda io.to ile yapiyoruz 


        // Emit an event to the specific user's socket if they are connected
        if (to && to.socket_id) {
            io.to(to.socket_id).emit("new_friend_request", {});
        }
    })

})


process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1)
    })
});