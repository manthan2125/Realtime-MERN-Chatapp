import "dotenv/config";

import http from "http";
import app from "./app.js";
import connectToDB from "./src/db/db.js";
import {Server} from 'socket.io'
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import projectModel from "./src/models/project.model.js";


connectToDB()


const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use( async (socket, next) => {   // socket io ke through ek authenticate user hi connect kar paye

    try{

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        const projectId = socket.handshake.query.projectId;  

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error("Invalid projectId"));
        }

        socket.project = await projectModel.findById(projectId);

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

    socket.roomId = socket.project._id.toString();


    console.log("a user connected");

    socket.join(socket.roomId);

    socket.on("project-message", data => {

        console.log(data)

        socket.broadcast.to(socket.roomId).emit("project-message", data)
    })
    
    socket.on('disconnect', () => { 
        console.log("User disconnected");
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port} `); 
});