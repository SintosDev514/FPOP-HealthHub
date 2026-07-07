import express from "express";

import {
  SignUp,
  SignIn,
  Logout,
  SendVerifyEmailOtp,
  VerifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";

import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", SignUp);
authRouter.post("/login", SignIn);
authRouter.post("/logout", Logout);

authRouter.post("/sendEmailOtp", userAuth, SendVerifyEmailOtp);
authRouter.post("/VerifyEmail", userAuth, VerifyEmail);
authRouter.get("/isAuthenticated", userAuth, isAuthenticated);

authRouter.post("/sendResetOtp", sendResetOtp);
authRouter.post("/resetPassword", resetPassword);

authRouter.get("/me", userAuth, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

export default authRouter;
