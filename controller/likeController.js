import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";

const likeController = {
  addLike: async (req, res) => {
    const bookId = Number(req.params.bookId);
    const { userId } = req.body;
    const addSql = "INSERT INTO likes (userId, likedProductId) VALUES (?,?)";
    const values = [userId, bookId];

    try {
      await conn.query(addSql, values);
      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      console.log(error);
    }
  },
  removeLike: async (req, res) => {
    const bookId = Number(req.params.bookId);
    const { userId } = req.body;

    const values = [bookId, userId];
    const deleteSql =
      "DELETE FROM likes WHERE likedProductId = ? AND userId = ?";

    try {
      const [result] = await conn.query(deleteSql, values);

      if (result.affectedRows > 0) {
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      } else {
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default likeController;
