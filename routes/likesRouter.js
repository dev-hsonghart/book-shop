import express from "express";
const router = express.Router();
router.use(express.json());

import { body, param } from "express-validator";
import validate from "../middlewares/validator.js";
import likeController from "../controller/likeController.js";

// 좋아요
router
  .route("/:bookId")
  .post(
    param("bookId").notEmpty().isInt().withMessage("bookId를 확인해주세요"),
    validate,
    likeController.addLike,
  )
  .delete(likeController.removeLike);

export default router;
