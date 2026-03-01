import express from "express";
const router = express.Router();
router.use(express.json());

import orderController from "../controller/orderController.js";

router.route("/").post(orderController.order).get(orderController.getOrders);

router.get("/:orderId", orderController.getOrderDetail);

export default router;
