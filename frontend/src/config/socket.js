import socket from "socket.io-client";

let socketInstance = null  // socketInstance will represent the web socket connection between server and client

export const initializeSocket = () => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem("token")
        }
    });
    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cd);
}

export const sendMessage = (eventName, cb) => {
    socketInstance.emit(eventName, cd);
}