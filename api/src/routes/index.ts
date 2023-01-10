import express from "express";

import authRoutes from "./auth.route";
import recipeRoutes from "./recipe.route";
import ingredientRoutes from "./ingredient.route"; 

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/recipe", recipeRoutes);
router.use("/ingredient", ingredientRoutes); 

export default router;
