import express from "express";
import { signUpController } from "../controllers/signUpController.js";
import { signInController } from "../controllers/signInController.js";
import contactUsController from "../controllers/contactUsController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAndResetPassword.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/contact-us", contactUsController.submitContactForm);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

export default router;
