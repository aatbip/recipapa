import express from "express";
import { createRecipe, getAllRecipe, getOneRecipe, getUserRecipe, removeRecipe, searchRecipe, updateRecipe } from "../controllers/recipeController";

import { sessionVerification } from "../middleware/sessionVerification";
import { uploader } from "../middleware/uploader";

const router = express.Router();

router.get("/all", getAllRecipe); 
router.get("/search", searchRecipe); 
router.post("/add", sessionVerification, uploader, createRecipe);
router.get("/:recipeId", getOneRecipe); 
router.patch("/:recipeId", sessionVerification, uploader, updateRecipe); 
router.get("/", sessionVerification, getUserRecipe); 
router.delete("/:recipeId", sessionVerification, removeRecipe); 

export default router;
