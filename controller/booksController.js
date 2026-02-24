import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";

const booksController = {
  getBooks: async (req, res) => {
    // 이미지 경로 누락
    const { categoryId, newBooks, limit, currentPage } = req.query;
    let offset = limit * (currentPage - 1);

    let getBooks = {
      items: [],
      totalCount: 0,
    };
    let getBooksRows = "";
    let getBooksSql =
      "SELECT *,(SELECT count(*) FROM likes WHERE likedProductId = books.id) AS total_likes FROM books";
    let values = [];

    if (categoryId && newBooks) {
      getBooksSql += ` WHERE categoryId = ? AND pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values.push(categoryId);
    } else if (categoryId) {
      getBooksSql += ` WHERE categoryId = ?`;
      values.push(categoryId);
    } else if (newBooks) {
      getBooksSql += ` WHERE pubDate BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }
    getBooksSql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), parseInt(offset));

    try {
      [getBooksRows] = await conn.query(getBooksSql, values);

      if (getBooksRows.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }

      getBooks.items = getBooksRows;
      getBooks.totalCount = getBooksRows.length;

      return res.status(StatusCodes.OK).json(getBooks);
    } catch (error) {
      console.log(error);
    }
  },
  getBook: async (req, res) => {
    //이미지 경로, 좋아요 여부, 좋아요 수 누락
    try {
      let bookId = Number(req.params.bookId);
      const userId = Number(req.body.userId);

      const getBookSql = `SELECT *, (SELECT count(*) FROM likes WHERE likedProductId = books.id )AS likes ,(SELECT EXISTS (SELECT * FROM likes WHERE userId = ? AND likedProductId = ? ))AS liked FROM books 
LEFT JOIN category ON books.categoryId = category.categoryId WHERE books.id = ?;`;
      const getBookValues = [userId, bookId, bookId];
      const [[getBookRow]] = await conn.query(getBookSql, getBookValues);

      if (getBookRow === undefined) {
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }

      const getBookResult = { baseInfo: getBookRow };
      res.status(StatusCodes.OK).json(getBookResult);
    } catch (error) {
      console.log(error);
    }
  },
};

export default booksController;
