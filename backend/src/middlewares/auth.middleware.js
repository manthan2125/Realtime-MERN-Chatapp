import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message: "Unauthorized user"
            })
        }

        // if token exists in redis  -> then -> await redisClient.get(token) -> will return "logout"(value stored in redis) else null
        const isTokenBlacklisted = await redisClient.get(token);

        if(isTokenBlacklisted){
            res.clearCookie("token");
            return res.status(401).send({ error: "Unauthorized user"}) 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        req.user = decoded; // decoded contains only email
        next();
    } catch(err) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }
}