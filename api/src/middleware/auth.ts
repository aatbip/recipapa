import { NextFunction, Request, Response } from "express";
import { IGetAuthorizationHeaderRequest } from "../interfaces/auth.interface";
import { asyncWrapper } from "../utils/asyncWrapper";
import { failure } from "../utils/responseMessage";

const isAuth = asyncWrapper(
  async (
    req: IGetAuthorizationHeaderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.user;

    if (userId) {
      return next();
    }

    return res.json(failure("You are not authorized!"));
  }
);

export { isAuth };
