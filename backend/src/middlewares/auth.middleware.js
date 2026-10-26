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
        // First, remember that Redis stores data as key-value pairs.
        // Key	   ---      Value
        // abc123  ---  	"logout" 
        // If that token exists in redis it returns logout else null   
        
        // redisClient.get() is asynchronous
        const isTokenBlacklisted = await redisClient.get(token);

        // Agar redis mein wo token hoga (blacklisted token) to seedha retrun unauthorisez user ho jaega
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