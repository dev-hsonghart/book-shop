import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import usersRouter from "./routes/usersRouter.js";
app.use("/users", usersRouter);

// import cartsRouter from "./routes/cartsRouter.js";
// app.use("/cart", cartsRouter);

// import likesRouter from "./routes/likesRouter.js";
// app.use("/likes", likesRouter);

// import orderRouter from "./routes/ordersRouter.js";
// app.use("/orders", orderRouter);

import filterRouter from "./routes/filterRouter.js";
app.use("/category", filterRouter);

import booksRouter from "./routes/booksRouter.js";
app.use("/books", booksRouter);
