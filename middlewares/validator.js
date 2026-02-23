import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    next();
  } else {
    return res.status(400).json(err.array());
  }
};

export default validate;
