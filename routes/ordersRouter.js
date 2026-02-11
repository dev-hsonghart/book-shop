import express from "express";
const router = express.Router();
router.use(express.json());

// 좋아요
router
  .route("/")
  .post((req, res) => {
    res.json({ message: "결제완료" });
  })
  .get((req, res) => {
    res.json({ message: "주문 목록 조회" });
  })
  .Get("/:orderId", (req, res) => {
    res.json({ message: "주문 상품 상세 조회" });
  });

export default router;
