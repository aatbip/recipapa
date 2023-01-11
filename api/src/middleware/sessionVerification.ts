import { NextFunction, Request, Response } from "express";
import {
  IGetAuthorizationHeaderRequest,
  IJwtPayload,
  IUserCredentials,
} from "../interfaces/auth.interface";
import { RefreshToken } from "../models/RefreshToken";
import User from "../models/User";
import { asyncWrapper } from "../utils/asyncWrapper";
import { failure, success } from "../utils/responseMessage";
import { verifyJwt } from "../utils/verifyJwt";

export const sessionVerification = asyncWrapper(
  async (
    req: IGetAuthorizationHeaderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(404)
        .json(
          failure("Invalid authentication header. Please send bearer token. ")
        );
    }

    const accessToken = authHeader.split(" ")[1];
    setUser(accessToken, req, res, next);
  }
);

const setUser = async (
  accessToken: string,
  req: IGetAuthorizationHeaderRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload, expired } = verifyJwt(accessToken);

    req.user = payload as IJwtPayload;
    return next();
  } catch (error) {
    next(error);
  }
};


export const setNewAccessToken = asyncWrapper(
  async (
    req: IGetAuthorizationHeaderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { refreshToken } = req.body;

    const isRefreshTokenExist = await RefreshToken.findOne({
      refreshToken: refreshToken,
    });

    if (!isRefreshTokenExist) {
      return res
        .status(400)
        .json(failure("Authentication Error! Token doesn't exist or match."));
    }

    const { payload, expired, error } = verifyJwt(refreshToken);

    if (expired === "jwt expired") {
      return next(error);
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res
        .status(400)
        .json(failure("Authentication Error! Token doesn't exist or match."));
    }

    let accessToken = user.createAccessToken();

    const userCredentials: IUserCredentials = {
      id: user._id,
      username: user.username,
      accessToken,
      refreshToken,
    };

    res.status(200).json(userCredentials);
  }
);

