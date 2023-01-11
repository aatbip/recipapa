import { Request, Response } from "express";
import { IUserCredentials } from "../interfaces/auth.interface";
import { RefreshToken } from "../models/RefreshToken";
import User from "../models/User";
import { asyncWrapper } from "../utils/asyncWrapper";
import { success, failure } from "../utils/responseMessage";

const signUp = asyncWrapper(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(failure("Please enter all required fields!"));
  }

  let checkUserExists = await User.findOne({ username: username });

  if (checkUserExists) {
    return res.status(404).json(failure("username already exits!"));
  }

  let user = await User.create({ username, password });

  return res.status(200).json(success(user));
});

const signIn = asyncWrapper(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(failure("Enter all required fields!"));
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).json(failure("Username doesn't exist!"));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(400).json(failure("Username or password is incorrect!"));
  }

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  await RefreshToken.create({
    refreshToken: refreshToken,
  });

  const userCredentials: IUserCredentials = {
    id: user._id,
    username,
    accessToken,
    refreshToken,
  };

  return res.status(200).json(success(userCredentials));
});

const signOut = asyncWrapper((req: Request, res: Response) => {
  res.clearCookie("userCredentials");

  res.status(200).json(success("You are Signed Out!"));
});

export { signUp, signIn, signOut };
