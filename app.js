import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import usersRouter from "./routes/usersRouter";
app.use("/users", usersRouter);

import cartsRouter from "./routes/cartsRouter";
app.use("/cart", cartsRouter);

import likesRouter from "./routes/likesRouter";
app.use("/likes", likesRouter);

import orderRouter from "./routes/ordersRouter";
app.use("/orders", orderRouter);

import booksRouter from "./routes/booksRouter";
app.use("/books", booksRouter);
