import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js"
import { validationResult } from "express-validator";



export const createUserController = async(req, res) => {
    // It returns an object containing the validation results.
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    try{
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();

        res.cookie("token", token);

        res.status(201).json({
            message: "User created successfully",
            user: user,
            token
        });
    } catch(err){
        res.status(400).send(err.message);
    }
}

export const loginUserController = async(req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try{
        const { email, password } = req.body;

        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordValid = user.isValidPassword(password);

        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Credentials",
            })
        }

        const token = await user.generateJWT();

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user,
            token
        })
    } catch(err) {
        console.log(err)
        res.status(400).send(err.message);
    }
}

export const profileController = async(req, res) => {
    res.status(200).json({
        message: "User fetched successfully",
        user: req.user   // we have directly do this bcoz in our Schema there are only 2 fileds email and password(password is not shown by defaylt)
    })
}