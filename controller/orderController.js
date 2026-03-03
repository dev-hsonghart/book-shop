import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import ensureAuthorization from "../middlewares/auth.js";
import errorHandler from "../utils/errorHandler.js";

const orderController = {
  order: async (req, res) => {
    const {
      cartItems,
      delivery,
      totalCount,
      totalPrice,
      mainBookTitle,
      preOderItems,
    } = req.body;

    let deliveryId;
    let orderId;

    const connection = await conn.getConnection();
    try {
      const userId = ensureAuthorization(req, res);

      await connection.beginTransaction();

      // delivery insert
      const { address, receiver, contact } = delivery;
      const deliveryInsertSql =
        "INSERT INTO delivery (id, address, receiver, contact) VALUES (NULL, ?, ?, ?)";
      const deliveryValues = [address, receiver, contact];

      const [deliveryResult] = await connection.execute(
        deliveryInsertSql,
        deliveryValues,
      );
      deliveryId = deliveryResult.insertId;

      // orders insert
      const ordersInsertSql =
        "INSERT INTO orders VALUES (NULL, ?, ?, ?, DEFAULT, ?, ?)";
      const ordersInsertValues = [
        deliveryId,
        totalPrice,
        totalCount,
        mainBookTitle,
        userId,
      ];

      const [orderResult] = await connection.execute(
        ordersInsertSql,
        ordersInsertValues,
      );

      orderId = orderResult.insertId;

      // orderedItems insert

      const orderedItemsValues = preOderItems.map((item) => [
        orderId,
        item.bookId,
        item.count,
      ]);
      const orderedItemsSql =
        "INSERT INTO orderedItems (orderedId, bookId, count) VALUES ?";
      const [orderedResult] = await connection.query(orderedItemsSql, [
        orderedItemsValues,
      ]);

      if (orderedResult.affectedRows !== orderedItemsValues.length) {
        throw new Error("주문 DB에 제대로 삽입되지 못했다");
      }

      // 주문 요청한 cartItems 삭제
      const cartItemDeleteSql = "DELETE FROM cartItems WHERE cartItemId IN (?)";
      const [cartItemDeleteResult] = await connection.query(cartItemDeleteSql, [
        cartItems,
      ]);

      if (cartItemDeleteResult.affectedRows == 0)
        throw new Error("해당 주문은 이미 주문이 들어갔어");

      await connection.commit();

      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      await connection.rollback();
      errorHandler(res, error);
      console.log(error);
    } finally {
      connection.release();
    }
  },
  getOrders: async (req, res) => {
    const userId = ensureAuthorization(req, res);
    let result = [];

    const sql =
      "SELECT orders.id, createdAt, delivery.address,delivery.receiver,delivery.contact, bookTitle, totalPrice, totalCount FROM orders LEFT JOIN delivery ON orders.deliverId = delivery.id WHERE userId = ?";
    try {
      const [rowData] = await conn.execute(sql, [userId]);
      result = rowData.map((data) => ({
        orderId: data.id,
        createdAt: data.createdAt,
        delivery: {
          address: data.address,
          receiver: data.receiver,
          contact: data.contact,
        },
        bookTitle: data.bookTitle,
        totalPrice: data.totalPrice,
        totalCount: data.totalCount,
      }));
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      errorHandler(res, error);
      console.log(error);
    }
  },
  getOrderDetail: async (req, res) => {
    const userId = ensureAuthorization(req, res);

    const orderId = Number(req.params.orderId);
    const sql = `SELECT orderedItems.bookId, books.title AS bookTitle, books.author, books.price, orderedItems.count 
                FROM orderedItems 
                LEFT JOIN books ON orderedItems.bookId = books.id 
                LEFT JOIN orders ON orderedItems.orderedId = orders.id
                WHERE orderedId = ? AND orders.userId = ?`;

    try {
      const [result] = await conn.execute(sql, [orderId, userId]);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      errorHandler(res, error);
      console.log(error);
    }
  },
};

export default orderController;
