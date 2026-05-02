import { validationResult } from "express-validator";
import validationError from "../Utilities/handleValidationError.js";

export const validateResult = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new validationError("validation fail", errors.array()))
    }
    next()
};
