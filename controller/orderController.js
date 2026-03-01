import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";

const orderController = {
  order: async (req, res) => {
    const {
      cartItems,
      delivery,
      totalCount,
      totalPrice,
      userId,
      mainBookTitle,
      preOderItems,
    } = req.body;

    let deliveryId;
    let orderId;

    const connection = await conn.getConnection();

    try {
      await connection.beginTransaction();

      // delivery insert
      const { address, receiver, contact } = delivery;
      const deliveryInsertSql =
        "INSERT INTO delivery (id, address, receiver, contact) VALUES (NULL, ?, ?, ?)";
      const deliveryValues = [address, receiver, contact];

      const [deliveryResult] = await conn.execute(
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

      const [orderResult] = await conn.execute(
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
      const [orderedResult] = await conn.query(orderedItemsSql, [
        orderedItemsValues,
      ]);

      if (orderedResult.affectedRows !== orderedItemsValues.length) {
        throw new Error("주문 DB에 제대로 삽입되지 못했다");
      }

      // cartItem 삭제 - 초안 api 기준
      //   const cartItemDeleteSql = "DELETE FROM cartItems WHERE cartItemId IN (?)";
      //   const cartItemsValues = cartItems.map((item) => item.cartItemId);
      //   const [cartItemDeleteResult] = await conn.query(cartItemDeleteSql, [
      //     cartItemsValues,
      //   ]);

      // cartItems 삭제 - req.body 수정 버전
      const cartItemDeleteSql = "DELETE FROM cartItems WHERE cartItemId IN (?)";
      const [cartItemDeleteResult] = await conn.query(cartItemDeleteSql, [
        cartItems,
      ]);

      if (cartItemDeleteResult.affectedRows == 0)
        // return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
        throw new Error("장바구니 목록을 지울 수 없어");

      await connection.commit();

      res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch (error) {
      await connection.rollback();
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    } finally {
      connection.release();
    }
  },
  getOrders: async (req, res) => {
    const userId = Number(req.body.userId);
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  getOrderDetail: async (req, res) => {
    const orderId = Number(req.params.orderId);
    const sql = `SELECT orderedItems.bookId,  books.title AS bookTitle, books.author, books.price, orderedItems.count 
                FROM orderedItems LEFT JOIN books 
                ON orderedItems.bookId = books.id 
                WHERE orderedId = ?`;

    try {
      const [result] = await conn.execute(sql, [orderId]);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },
};

export default orderController;
