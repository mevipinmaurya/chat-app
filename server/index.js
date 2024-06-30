import express from "express"
import cors from "cors";
import http, { createServer } from 'http';
import {Server} from 'socket.io';

const port = 3000 || process.env.PORT;
const app = express()
app.use(cors())

app.get("/", (req, res)=>{
    res.send("I am root")
})


const users = [{}];

const server = createServer(app);
const io = new Server(server)

io.on("connection", (socket)=>{
    console.log("New connection")

    socket.on("joined", ({user})=>{
        console.log(`${user} joined the chat`)
        users[socket.id] = user;

        // Sending the joined message to everyone except the user that has joined
        socket.broadcast.emit("user-joined", {user : "Admin", message : `${users[socket.id]} has Joined !!`})

        // Message for a new joined user
        socket.emit("welcome", {user : "Admin", message : `welcome to the chat ${users[socket.id]}`})
    })

    // To display all messages
    socket.on("message", ({message, id})=>{
        io.emit("sendMessage", {user : users[id], message, id})
    })

    // When any user left the chat
    socket.on("disconnect", ()=>{
        socket.broadcast.emit("user-left", {user : "Admin", message : `${users[socket.id]} has left.`})
    })


})

server.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})