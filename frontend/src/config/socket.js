import socket from "socket.io-client";

// socketInstance - rep socket.io client connection
// Important: Your socketInstance represents the client-side Socket.IO connection, while your backend io represents the Socket.IO server.
let socketInstance = null  // socketInstance will represent the web socket connection between server and client


// socketInstance holds the Socket.IO client object/connection instance returned by socket().
// It is not just a simple ID or token.
// It contains methods and information that let you communicate with the server, for example:
// socketInstance.emit(...)
// socketInstance.on(...)
// socketInstance.disconnect()

// socketInstance - ye ek object hai  ----- on(), emit() -> ye methods


export const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {                 // socket() creates a Socket.IO client connection to your backend.
        auth: {
            token: localStorage.getItem("token")       // Gets the JWT from localStorage and sends it during the Socket.IO handshake.
        },
        query: {
            projectId
        }
    });
    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, cb) => {
    socketInstance.emit(eventName, cb);
}