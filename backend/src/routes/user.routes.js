import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator"
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/register", 
    [
        body("email").isEmail().withMessage("Email must be a valid email address"),
        body("password").isLength({min : 3}).withMessage("Password must contain atleast 3 characters")
    ],
    userController.createUserController
);

router.post("/login", 
    [
    body("email").isEmail().withMessage("Email must be a valid email address"),
    body("password").isLength({min : 3}).withMessage("Password must contain atleast 3 characters")
    ],
    userController.loginUserController
)

router.get("/profile", authMiddleware.authUser, userController.profileController);

router.get("/logout", authMiddleware.authUser, userController.logoutUserController)



export default router;