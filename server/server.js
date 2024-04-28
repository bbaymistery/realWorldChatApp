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
const FriendRequest = require("./models/friendRequest");
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
    console.log({ user_id, socket_id });

    if (user_id) await User.findByIdAndUpdate(user_id, { socket_id })
    

    socket.on("friend_request", async (data) => {
        console.log(data.to)
        const to_user = await User.findById(data.to).select("socket_id")
        const from_user = await User.findById(data.from).select("socket_id")

        //create a friend request
        await FriendRequest.create({ sender: data.from, recepient: data.to })

        // emit event request received to recipient
        io.to(to_user?.socket_id).emit("new_friend_request", {
            message: "New friend request received",
        });

        io.to(from_user?.socket_id).emit("request_sent", {
            message: "Request Sent successfully!",
        });
    })

    socket.on("accept_request", async (data) => {
        // accept friend request => add ref of each other in friends array
        //we send request_id which contain information => who sent request who received this req
        console.log(data);
        const request_doc = await FriendRequest.findById(data.request_id);

        console.log(request_doc);

        const sender = await User.findById(request_doc.sender);
        const receiver = await User.findById(request_doc.recipient);

        sender.friends.push(request_doc.recipient);
        receiver.friends.push(request_doc.sender);

        await receiver.save({ new: true, validateModifiedOnly: true });
        await sender.save({ new: true, validateModifiedOnly: true });

        await FriendRequest.findByIdAndDelete(data.request_id);

        // delete this request doc
        // emit event to both of them

        // emit event request accepted to both
        io.to(sender?.socket_id).emit("request_accepted", {
            message: "Friend Request Accepted",
        });
        io.to(receiver?.socket_id).emit("request_accepted", {
            message: "Friend Request Accepted",
        });
    });

    socket.on("end", async (data) => {
        // Find user by ID and set status as offline

        if (data.user_id) await User.findByIdAndUpdate(data.user_id, { status: "Offline" })

        // broadcast to all conversation rooms 
        //.. of this user that this user is offline (disconnected)
        console.log("closing connection");
        socket.disconnect(0);
    });

})


process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1)
    })
});