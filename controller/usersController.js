import connection from "../mariaDb.js";
const conn = connection;

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
// 회원가입

const usersController = {
  join: async (req, res) => {
    const { email, password, name } = req.body;

    const isUsersSql = "SELECT * FROM users WHERE email = ?";
    const isUserValues = email;
    const [[isUser]] = await conn.query(isUsersSql, isUserValues);

    try {
      const salt = crypto.randomBytes(10).toString("base64");
      const hashPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 10, "sha512")
        .toString("base64");

      const insertUsersSql =
        "INSERT INTO users (email,password,name, salt) VALUES (?,?,?,?)";
      const insertUsersValues = [email, hashPassword, name, salt];
      if (isUser) {
        res
          .status(StatusCodes.CONFLICT)
          .send({ error: "이미 존재하는 회원입니다." });
      } else {
        await conn.query(insertUsersSql, insertUsersValues);
        res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
      }
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // 입력한 password를 db의 salt를 불러와 암호화 처리를 함
      const [[{ salt }]] = await conn.query(
        "SELECT salt FROM users WHERE email = ?",
        [email],
      );
      const hashPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 10, "sha512")
        .toString("base64");

      // 이메일이 존재하고 password가 동일할 때 로그인 성공 및 jwt 토큰 발급
      const isActiveSql = "SELECT * FROM users WHERE email = ?";
      const isActiveValues = [email, hashPassword];
      const [[isActive]] = await conn.query(isActiveSql, isActiveValues);
      console.log(isActive);

      if (isActive) {
        //jwt 토큰 발급
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "5m",
            issuer: "hsh",
          },
        );
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ error: "회원 정보를 다시 확인해주세요." });
      }
    } catch (error) {
      console.log(error);
    }
  },

  passwordRequestReset: async (req, res) => {
    const { email } = req.body;
    const isEmailSql = "SELECT * FROM users WHERE email = ?";
    const isEmailValues = [email];
    const isEmail = await conn.query(isEmailSql, isEmailValues);

    try {
      if (isEmail) {
        return res.status(StatusCodes.OK).json(email);
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
      }
    } catch (error) {
      console.log(error);
    }
  },

  passwordReset: async (req, res) => {
    const { email, password } = req.body;

    const isEmailSql = "SELECT * FROM users WHERE email = ?";
    const isEmailValues = [email];
    const isEmail = await conn.query(isEmailSql, isEmailValues);

    try {
      if (isEmail.length === 0) {
        return res.status(StatusCodes.UNAUTHORIZED).end();
      }
      const resetSql =
        "UPDATE users SET password = ?, salt = ? WHERE email = ?";

      const salt = crypto.randomBytes(10).toString("base64");
      const hashPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 10, "sha512")
        .toString("base64");

      const resetValues = [hashPassword, salt, email];
      await conn.query(resetSql, resetValues);

      res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).end();
      console.log(error);
    }
  },
};

export default usersController;
