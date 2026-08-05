import mongoose from "mongoose";

const connectToDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\nMongoDB connected !!  DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(err){
        console.log("MONGODB connection failed", err);
        process.exit(1);
    }
}

export default connectToDB;