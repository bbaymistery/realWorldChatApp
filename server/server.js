const app = require("./app");
const mongoose = require("mongoose");
const OneToOneMessage = require("./models/OneToOneMessage");
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

const path = require("path");

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
//const mongoseOptions = { useNewUrlParser: true, useUnifiedTopology: true  }=>ikiside deprecetad olub
const mongoseOptions = {}

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

    if (user_id) await User.findByIdAndUpdate(user_id, { socket_id, status: "Online" })


    // We can write our socket event listeners in here...
    socket.on("friend_request", async (data) => {
        const to = await User.findById(data.to).select("socket_id");
        const from = await User.findById(data.from).select("socket_id");

        // create a friend request
        await FriendRequest.create({
            sender: data.from,
            recipient: data.to,
        });
        // emit event request received to recipient
        io.to(to?.socket_id).emit("new_friend_request", {
            message: "New friend request received",
        });
        io.to(from?.socket_id).emit("request_sent", {
            message: "Request Sent successfully!",
        });
    });

    socket.on("accept_request", async (data) => {
        // accept friend request => add ref of each other in friends array
        //we send request_id which contain information => who sent request who received this req
        const request_doc = await FriendRequest.findById(data.request_id);
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

    socket.on("get_direct_conversations", async ({ user_id }, callback) => {

        const existing_conversations = await OneToOneMessage.find({
            participants: { $all: [user_id] },
        }).populate("participants", "firstName lastName avatar _id email status");

        // db.books.find({ authors: { $elemMatch: { name: "John Smith" } } })

        console.log(existing_conversations);
        //we pass list of all conversation which user has
        callback(existing_conversations);
    });

    //bu hisse Cahts yaindaki user icona tikliyanda friends bolmesindeki friendse tikliyanda calisir
    // components=>UserElemnt FriendElement   bax goreceyse
    socket.on("start_conversation", async (data) => {
        // data: {to: from:}

        const { to, from } = data;

        // check if there is any existing conversation

        const existing_conversations = await OneToOneMessage.find({
            participants: { $size: 2, $all: [to, from] },
        }).populate("participants", "firstName lastName _id email status");
        
        // if no => create a new OneToOneMessage doc & emit event "start_chat" & send conversation details as payload
        if (existing_conversations.length === 0) {
            let new_chat = await OneToOneMessage.create({ participants: [to, from] });
            new_chat = await OneToOneMessage.findById(new_chat).populate("participants", "firstName lastName _id email status");
            // console.log(new_chat);
            socket.emit("start_chat", new_chat);
        }
        // if yes => just emit event "start_chat" & send conversation details as payload
        else {
            socket.emit("start_chat", existing_conversations[0]);
        }
    
    });
 
    //!get messages bunu yoxla
    socket.on("get_messages", async (data, callback) => {
        try {
            const { messages } = await OneToOneMessage.findById(data.conversation_id).select("messages");
            callback(messages);
            console.log({ messages });

        } catch (error) {
            console.log(error);
        }
    });

    console.log({ user_id, socket_id });

    // evet daha once asagidakini eklemisdik bilirem ama normalda bu videoda eklenib
    // Handle incoming text/link messages
    socket.on("text_message", async (data) => {
        console.log("Received message:", data);

        const { message, conversation_id, from, to, type } = data;
        const text = message

        const to_user = await User.findById(to);
        const from_user = await User.findById(from);

        // message => {to, from, type, created_at, text, file}

        const new_message = { to, from, type, created_at: Date.now(), text };

        // fetch OneToOneMessage Doc & push a new message to existing conversation
        const chat = await OneToOneMessage.findById(conversation_id);
        chat.messages.push(new_message);
        // save to db`
        await chat.save({ new: true, validateModifiedOnly: true });

        // emit incoming_message -> to user
        io.to(to_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });

        // emit outgoing_message -> from user
        io.to(from_user?.socket_id).emit("new_message", {
            conversation_id,
            message: new_message,
        });
    });

    // handle Media/Document Message
    socket.on("file_message", (data) => {
        console.log("Received message:", data);

        // data: {to, from, text, file}

        // Get the file extension
        const fileExtension = path.extname(data.file.name);

        // Generate a unique filename
        const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}${fileExtension}`;

        // upload file to AWS s3

        // create a new conversation if its dosent exists yet or add a new message to existing conversation

        // save to db

        // emit incoming_message -> to user

        // emit outgoing_message -> from user
    });

    socket.on("end", async (data) => {
        // Find user by ID and set status as offline
        if (data.user_id) await User.findByIdAndUpdate(data.user_id, { status: "Offline" })
        // broadcast to all conversation rooms ..
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