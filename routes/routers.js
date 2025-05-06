import express from "express";
import { googleSignIn, signUpController } from "../controllers/signUpController.js";
import { signInController, verify } from "../controllers/signInController.js";
import contactUsController from "../controllers/contactUsController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAndResetPassword.js";
import { verifyToken } from "../controllers/verify.js";
import subscribe from "../controllers/subscribe.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/contact-us", contactUsController.submitContactForm);
router.post("/google", googleSignIn);
router.post("/subscribe", subscribe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.get("/verify", verifyToken, verify);

export default router;
