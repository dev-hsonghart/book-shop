import express from "express";
const router = express.Router();
router.use(express.json());

import { body } from "express-validator";
import validate from "../middlewares/validator.js";
import usersController from "../controller/usersController.js";

// 회원가입
router.post(
  "/",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요"),
    body("name").notEmpty().isString().withMessage("이름을 확인해주세요"),
    validate,
  ],
  usersController.join,
);

router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요"),
    validate,
  ],
  usersController.login,
);

router
  .route("/reset")
  .post(usersController.passwordRequestReset)
  .put(usersController.passwordReset);

export default router;
