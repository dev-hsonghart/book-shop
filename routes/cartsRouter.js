import express from "express";
const router = express.Router();
router.use(express.json());

// 좋아요
router
  .route("/")
  .post((req, res) => {
    res.json({ message: "장바구니 담기" });
  })
  .get("/all", (req, res) => {
    res.json({ message: "장바구니 조회" });
  })
  .delete("/:cartItemId", (req, res) => {
    res.json({ message: "장바구니 삭제" });
  })
  .get((req, res) => {
    res.json({ message: "주문 요청 페이지" });
  });

export default router;
