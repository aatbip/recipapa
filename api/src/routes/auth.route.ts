import express, { Response, Request, NextFunction } from "express";

import { signUp, signIn, signOut } from "../controllers/authController";
import {
  checkIfTokenExpired,
  sessionVerification,
} from "../middleware/sessionVerification";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/verifysession", sessionVerification, checkIfTokenExpired);

export default router;
