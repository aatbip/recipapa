import express, { Response, Request, NextFunction } from "express";

import { signUp, signIn, signOut } from "../controllers/authController";
import {
  setNewAccessToken,
} from "../middleware/sessionVerification";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/refresh", setNewAccessToken);


export default router;
