import { body } from "express-validator";

export const registerValidator = [

body("name")
.trim()
.notEmpty()
.withMessage("Name is required"),

body("email")
.isEmail()
.withMessage("Valid email is required"),

body("password")
.isLength({ min: 6 })
.withMessage("Password must be at least 6 characters"),

body("role")
.optional()
.isIn(["citizen", "doctor", "hospital_admin", "operator"])
.withMessage("Invalid role")

];

export const loginValidator = [

body("email")
.isEmail()
.withMessage("Valid email required"),

body("password")
.notEmpty()
.withMessage("Password required")

];
