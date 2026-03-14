import ApiError from '../utils/ApiError.js'
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {

const errors = validationResult(req);

if (!errors.isEmpty()) {
return res.status(400).json({
status: "error",
errors: errors.array()
});
}

next();
};

// Emergency validation
export const validateEmergency = (req, res, next) => {

const { symptoms, location } = req.body;

if (!symptoms) {
return res.status(400).json({
status: "error",
message: "Symptoms required"
});
}

if (
!location ||
typeof location.lat !== "number" ||
typeof location.lng !== "number"
) {
return res.status(400).json({
status: "error",
message: "Valid location required"
});
}

next();
};
