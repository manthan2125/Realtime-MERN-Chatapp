import socket from "socket.io-client";

let socketInstance = null  // socketInstance will represent the web socket connection between server and client

export const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem("token")
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