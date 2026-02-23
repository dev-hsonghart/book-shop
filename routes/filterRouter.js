import express from "express";
const router = express.Router();
router.use(express.json());

import filterController from "../controller/filterController.js";

router.get("/", filterController.getCategory);
export default router;
