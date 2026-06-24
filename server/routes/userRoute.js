import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, updateUserData } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

console.log("user routes loaded");

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.put("/update", userAuth, upload.single("avatar"), updateUserData);

export default userRouter;
