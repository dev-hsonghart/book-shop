import express from "express";
const router = express.Router();
router.use(express.json());

// 상품 조회
router
  .route("/")
  .get((req, res) => {
    res.json({ message: "전체 책 조회" });
  })
  .get("/:bookId", (req, res) => {
    res.json({ message: "책 개별조회" });
  })
  .get((req, res) => {
    res.json({ message: "카테고리별 조회" });
  });

export default router;
