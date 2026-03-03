import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import ensureAuthorization from "../middlewares/auth.js";
import errorHandler from "../utils/errorHandler.js";

const booksController = {
  getBooks: async (req, res) => {
    // 이미지 경로 누락
    const { categoryId, newBooks, limit, currentPage } = req.query;
    let offset = limit * (currentPage - 1);

    let getBooksRes = {
      items: { item: [] },
      pageInfo: { currentPage: 0 },
    };
    let getBooksRows = "";
    let getBooksSql =
      "SELECT SQL_CALC_FOUND_ROWS *,(SELECT count(*) FROM likes WHERE likedProductId = books.id) AS totalLikes FROM books";
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

      const selectFoundRows = "SELECT found_rows() AS totalCounts";
      const [[foundRowsResult]] = await conn.execute(selectFoundRows);

      getBooksRes.items.item = getBooksRows;
      getBooksRes.pageInfo.totalCounts = foundRowsResult.totalCounts;
      getBooksRes.pageInfo.currentPage = Number(currentPage);

      return res.status(StatusCodes.OK).json(getBooksRes);
    } catch (error) {
      console.log(error);
    }
  },
  getBook: async (req, res) => {
    //이미지 경로 누락
    try {
      let bookId = Number(req.params.bookId);
      const userId = ensureAuthorization(req, res, false);

      const getBookSql = `SELECT *, 
                          (SELECT count(*) FROM likes WHERE likedProductId = books.id )AS likes ,
                          (SELECT EXISTS (SELECT * FROM likes WHERE userId = ? AND likedProductId = ? ))AS liked 
                          FROM books 
                          LEFT JOIN category ON books.categoryId = category.categoryId 
                          WHERE books.id = ?;`;
      const getBookValues = [userId, bookId, bookId];
      const [[getBookRow]] = await conn.execute(getBookSql, getBookValues);

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
