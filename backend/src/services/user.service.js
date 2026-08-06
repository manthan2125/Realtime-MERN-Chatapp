import userModel from "../models/user.model.js";

export const createUser = async ({email, password}) => {
    if(!email || !password){
        throw new Error("Email and password both are required");
    }

    const hashedPassword = await userModel.hashPassword(password);

    // console.log(hashedPassword);

    const user = await userModel.create({
        email,
        password: hashedPassword
    });

    return user;
}

export const getAllUsers = async({userId}) => {  // returns all user except logged in user
    const users = await userModel.find({
        _id: { $ne : userId }
    }) ;

    return users;
}