import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must have at least 6 characters"],
        maxLength: [50, "Email must not be longer than 50 characters"]
    },
    password: {
        type: String,
        select: false
    }
})

// statics -> this creates Static methods belongs to model
userSchema.statics.hashPassword  = async function (password) {
    return await bcrypt.hash(password, 10);
}

// methods -> this creates instance methods that belong to a specific document of that model
userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = async function(){
    return jwt.sign(
        { email: this.email }, 
        process.env.jWT_SECRET, 
        { expiresIn: "24h"}
    )
}

const User = mongoose.model("User", userSchema);

export default User;