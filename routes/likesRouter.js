import express from "express";
const router = express.Router();
router.use(express.json());

// 좋아요
router
  .route("/")
  .post("/:bookId", (req, res) => {
    res.json({ message: "좋아요 추가" });
  })
  .delete("/:bookId", (req, res) => {
    res.json({ message: "좋아요 삭제" });
  });

export default router;
