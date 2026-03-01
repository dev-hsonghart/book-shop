// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
const connection = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "BookShop",
  dateStrings: true,
  connectionLimit: 10,
});

export default connection;
