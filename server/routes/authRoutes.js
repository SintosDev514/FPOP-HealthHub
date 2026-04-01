import express from "express";

import { SignUp, SignIn, Logout } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", SignUp);
authRouter.post("/login", SignIn);
authRouter.post("/logout", Logout);

export default authRouter;
