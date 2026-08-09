import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectToDB from "./src/db/db.js";
import {Server} from 'socket.io'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import projectModel from "./src/models/project.model.js";
import { generateResult } from "./src/services/ai.service.js";


connectToDB()


const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Middleware
io.use( async (socket, next) => {   // socket io ke through ek authenticate user hi connect kar paye
// socket → the connecting client
    try{

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId;  

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error("Invalid projectId"));
        }

        socket.project = await projectModel.findById(projectId);          // finding that project in db

        if(!token){
            return next(new Error("Authentication Error"));
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return next(new Error("Authentication Error"));
        }

        socket.user = decoded; 

        next();

    } catch(err){
        next(err);
    }
})


io.on('connection', socket => {

    console.log("A user connected ", socket.id);      // every socket(client) has a socket id

    // socket.project._id          → ObjectId
    // socket.project._id.toString() → String
    socket.roomId = socket.project._id.toString();    // socket.project middleware se aaya jo uss project ko hold krta hai  


    socket.join(socket.roomId);

    socket.on("project-message", async (data) => {    // frontend pe : send( message, sender: user)
        // console.log(data)

        const message = data.message;
        // console.log("messsaageee",data)      // data ek object hai jiske andar message or sender naam ki field haii
        // console.log("messsaageee",data.message);

        const aiIsPresentInMessage = message.includes("@ai");
        socket.broadcast.to(socket.roomId).emit("project-message", data)

        if (aiIsPresentInMessage) {
            
            const prompt = message.replace("@ai", "");

            const result = await generateResult(prompt);      // result ->  contains the generated text as a string.

            io.to(socket.roomId).emit("project-message", {
                message: result ,         // ye jo result 
                sender: {
                    _id: "ai",
                    email: "AI"
                }
            })

            return 
        }

    })
    
    socket.on('disconnect', () => { 
        console.log("User disconnected");
        socket.leave(socket.roomId);
    });
});

// socket.on()                  → listen for an event
// socket.broadcast.to(room)   → send to others in room
// io.to(room).emit()          → send to everyone in room

server.listen(port, () => {
    console.log(`Server is running on port ${port} `); 
});