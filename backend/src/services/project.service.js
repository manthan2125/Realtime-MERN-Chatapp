import projectModel from "../models/project.model.js";


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