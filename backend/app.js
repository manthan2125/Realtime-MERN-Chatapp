import express from "express";
import morgan from "morgan";
import userRoutes from "./src/routes/user.routes.js"
import cookieParser from "cookie-parser"; 

const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use( "/users", userRoutes );

export default app;
