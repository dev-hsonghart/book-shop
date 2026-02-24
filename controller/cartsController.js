import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";

const cartsController = {
  addCartItem: async (req, res) => {
    const { bookId, count, userId } = req.body;
    const addItemSql =
      "INSERT INTO cartItems (bookId, count, userId) VALUES (?,?,?)";
    const values = [bookId, count, userId];

    const checkBookIdSql = `SELECT * FROM cartItems WHERE bookId = ${bookId}`;

    try {
      // bookId가 이미 존재한다면, count만 더하기
      const [[checkBookId]] = await conn.query(checkBookIdSql);

      if (checkBookId) {
        const addCountSql = `UPDATE cartItems SET count = count + ${count} WHERE bookId = ${bookId}`;
        const [addCountResult] = await conn.query(addCountSql);

        if (addCountResult.affectedRows > 0)
          return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
        else
          return res
            .status(StatusCodes.NOT_FOUND)
            .send(ReasonPhrases.NOT_FOUND);
      }

      await conn.query(addItemSql, values);
      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      console.log(error);
    }
  },
  deleteCartItem: async (req, res) => {
    const cartItemId = Number(req.params.cartItemId);
    const deleteItemSql = "DELETE FROM cartItems WHERE cartItemId = ?";
    const deleteValue = [cartItemId];

    try {
      const [deleteResult] = await conn.query(deleteItemSql, deleteValue);
      if (deleteResult.affectedRows > 0) {
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      }

      res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    } catch (error) {
      console.log(error);
    }
  },
  getCartItems: async (req, res) => {
    let { cartItems, userId } = req.body;
    userId = Number(userId);
    const checkItemSql = "SELECT * FROM cartItems WHERE userId = ?";
    const checkItemValue = [userId];

    try {
      // userId에 맞는 아이템이 있는지 체크
      const [checkResult] = await conn.query(checkItemSql, checkItemValue);
      if (checkResult.length == 0) {
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }

      let getItemsBaseSql =
        "SELECT cartItems.cartItemId, cartItems.count, books.id AS bookId, books.title, books.summary,books.price FROM cartItems LEFT JOIN books ON cartItems.bookId = books.id WHERE userId = ?";

      if (cartItems.length > 0) {
        // 선택한 장바구니 아이템 조회
        getItemsBaseSql += ` AND cartItemId IN (?)`;
        checkItemValue.push(cartItems);
      }

      const [getCartResult] = await conn.query(getItemsBaseSql, checkItemValue);
      return res.status(StatusCodes.OK).json(getCartResult);
    } catch (error) {
      console.log(error);
    }
  },
};

export default cartsController;
