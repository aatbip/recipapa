import jwt from "jsonwebtoken";
import { IJwtPayload } from "../interfaces/auth.interface";

export const verifyJwt = (token: string): IJwtPayload | any => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    return { payload };
  } catch (error: any) {
    return { expired: error.message, error };
  }
};
