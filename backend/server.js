import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connectToDB from "./src/db/db.js";

connectToDB()


const port = process.env.PORT || 3000;

const server = http.createServer(app);


server.listen(port, () => {
    console.log(`Server is running on port ${port} `); 
});