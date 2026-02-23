import express from "express";
const router = express.Router();
router.use(express.json());

import { body, param } from "express-validator";
import booksController from "../controller/booksController.js";
import validate from "../middlewares/validator.js";

// 상품 조회
router.route("/").get(booksController.getBooks);
router.get("/:bookId", booksController.getBook);
export default router;
