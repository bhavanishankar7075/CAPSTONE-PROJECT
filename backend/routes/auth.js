/* backend/routes/auth.js */
import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/*
  POST /api/auth/register
  Validation: username (min 3), email (valid), password (min 6)
*/
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Username min 3 chars"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")
  ],
  register
);

/*
  POST /api/auth/login
  Accepts emailOrUsername and password
*/
router.post(
  "/login",
  [
    body("emailOrUsername").notEmpty().withMessage("Email or username required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  login
);

export default router;
