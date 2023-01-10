import express from "express";
import {
  createIngredient,
  getAllIngredients,
} from "../controllers/ingredientController";

const router = express.Router();

router.post("/add", createIngredient);
router.get("/", getAllIngredients);

export default router;
