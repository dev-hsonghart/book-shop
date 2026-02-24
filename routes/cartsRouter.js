import express from "express";
const router = express.Router();
router.use(express.json());

import cartsController from "../controller/cartsController.js";

router
  .route("/")
  .post(cartsController.addCartItem)
  .get(cartsController.getCartItems);

router.delete("/:cartItemId", cartsController.deleteCartItem);

export default router;
