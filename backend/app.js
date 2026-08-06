import express from "express";
import morgan from "morgan";
import userRoutes from "./src/routes/user.routes.js"
import cookieParser from "cookie-parser"; 
import cors from "cors"
import projectRoutes from "./src/routes/project.routes.js"

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use( "/users", userRoutes );
app.use( "/projects", projectRoutes );

export default app;
