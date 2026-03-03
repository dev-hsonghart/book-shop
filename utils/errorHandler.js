import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const errorHandler = (res, error) => {
  if (error instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 만료" });
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "token이 문제" });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: `${error.message}` });
};

export default errorHandler;
