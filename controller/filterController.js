import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";

const filterController = {
  getCategory: async (req, res) => {
    const getSql = "SELECT * FROM category";
    const [results] = await conn.query(getSql);
    res.json(results);
  },
};

export default filterController;
