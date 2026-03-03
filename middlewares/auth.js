import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ensureAuthorization = (req, res, isRequired = true) => {
  try {
    let receivedJwt = req.headers["authorization"];

    if (!receivedJwt) {
      if (isRequired) {
        throw new Error("로그인이 필요해요");
      }
      return null;
    }

    const decodedPayload = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decodedPayload.id;
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
    throw error;
  }
};

export default ensureAuthorization;
