import projectModel from "../models/project.model.js";
import mongoose from "mongoose";


export const createProject = async ({name, userId}) => {

    if(!name) {
        throw new Error("Name is required"); 
    }
    if(!userId) {
        throw new Error("User is required"); 
    }

    try {
        const project = await projectModel.create({
            name,
            users: [ userId ]
        });

        return project;
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            throw new Error("Project name already existsss");
        }
        throw error;
    }
}

export const getAllProjectById = async ({userId}) => {
    if(!userId){
        throw new Error("UserId is required")
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects;
}

export const addUsersToProject = async({ projectId, users, userId}) => {
    // userId uss user ki id hai jo try kar rha hai dusre user ko add krne kii
    if(!projectId){
        throw new Error("projectId is required")
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid ProjectId")
    }

    if(!users){
        throw new Error("projectId is required")
    }
    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error ("Invalid userId(s) in users array")
    }

    if(!userId){
        throw new Error("userId is required");
    }
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

    // It finds on basis of 2 things - 
    // 1. projectId
    // 2. userId
    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    if(!project){
        throw new Error("User not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true   // means it will return updated project in  updatedProject
    });

    return updatedProject;


}

export const getProjectById = async({projectId}) => {
    if(!projectId){
        throw new Error("projectId is required");
    }

    const project = await projectModel.findOne({
        _id: projectId
    }).populate("users");

    return project;
}